/* ===== Sound Visualization Functions ===== */

/**
 * Set up webGl rendering context and canvas
 */
function setWebGLRenderingContext(){
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if(!gl){
        notifyUser('Unable to initialize sound visualizations. Your browser or machine might not support WebGL');
        return;
    }

    setCanvas();
}

function setCanvas(){
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    gl.viewport(0, 0, canvas.width, canvas.height);
}

/**
 * Sets the color for the audio visualizations.
 * Color changes every 5 seconds.
 */
function setColor(track){

    // Get the column the audio is currently playing at
    let col = (offset > 0) ? (offset/5) : 0;
    let gridspace = (track * columns) + col;

    let elId = 'filled-space--' + gridspace;
    let color = getSoundColor(elId, true);

    if(color === -1){
        color = [0, 0, 0, 1];
    }

    gl.uniform4fv(colorLocation, new Float32Array(color));
}

/**
 * Creates and returns a WebGlShader of the given type using 
 * the given GLSL source code. 
 * Compiles the GLSL shader into binary data to be used by a WebGlProgram.
 * 
 * @param {*} src A string of GLSL source code
 * @param {*} type The type of shader to create. Must be either gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
 * @returns {WebGLShader}
 */
function createShader(src, type){
    var shader = gl.createShader(type);
    
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    // Notify the user if the shader failed
    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        notifyUser('Unable to compile the shader program. See console for more info');
        console.log(gl.getProgramInfoLog(shader));
        return;
    }   

    return shader;
}

/**
 * Creates and returns a WebGlProgram. 
 * Attaches a vertex and fragment shader to the program 
 * based on the given strings and links the program to the WebGl rendering context.
 * 
 * @param {*} vstr A vertex shader string written in GLSL
 * @param {*} fstr A fragment shader string written in GLSL
 * @returns {WebGLProgram} A WebGlProgram
 */
function createProgram(vstr, fstr){
    var program = gl.createProgram();
    
    var vertexShader = createShader(vstr, gl.VERTEX_SHADER);
    var fragmentShader = createShader(fstr, gl.FRAGMENT_SHADER);

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    // Notify the user if the shader program failed
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        notifyUser('Unable to initiliaze the shader program. See console for more info');
        console.log(gl.getProgramInfoLog(program));
        return;
    }   

    return program;
}

/**
 * Set up the audio visualizations
 */
function setVisualizations(){
    // In case of canvas resizing
    setCanvas();

    var vertexPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);

    // Shaders
    var vs = `
        attribute vec2 vertexPosition;

        void main() {
            gl_Position = vec4(vertexPosition, 0, 1);
        }
    `;

    var fs = `
        precision mediump float;
        uniform vec4 color;

        void main() {
            gl_FragColor = color;
        }
    `;

    var program = createProgram(vs, fs);

    program.vertexPosAttrib = gl.getAttribLocation(program, 'vertexPosition');
    colorLocation = gl.getUniformLocation(program, 'color');

    gl.enableVertexAttribArray(program.vertexPosAttrib);
    gl.vertexAttribPointer(program.vertexPosAttrib, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);

    draw();
}


function draw(){
    animationTimer = requestAnimationFrame(draw);
    
    // In case of canvas resizing
    setCanvas();

    for (let track = 0; track < analysers.length; track++) {
        setColor(track);
        
        // Write to the buffer
        gl.bufferData(gl.ARRAY_BUFFER, getCoordinates(track), gl.STATIC_DRAW);

        gl.drawArrays(gl.LINE_STRIP, 0, analysers[track].fftSize);
    }
}

/**
 * Returns a Float32Array filled with data representing x and y coordinates. 
 * All data is between -1 and 1 (clipspace).
 * Even indices are the x-coordinates and odd indices are the y-coordinates. 
 * The y-coordinate represents audio waveform (time domain) data.
 * 
 * @param {*} track The track (row) whose coordinates we want
 * @returns {Float32Array}
 */
function getCoordinates(track){
    var bufferLength = analysers[track].fftSize;
    var waveform = new Float32Array(bufferLength);
    analysers[track].getFloatTimeDomainData(waveform);

    let coordinates = new Float32Array(bufferLength*2);
    var width = 2/bufferLength; // width of each x-coordinate from 0.0 -> 2.0

    for (let i = 0, j = 0; i < coordinates.length; i++) {
        if (i % 2 === 0) {
            coordinates[i] = i*width - 1; // Set each x-coordinate from -1 -> 1
        } else {
            coordinates[i] = waveform[j++]; // y-coordinate
        }
    }    

    return coordinates;
}

function pauseVisualizations(){
    cancelAnimationFrame(animationTimer);
}

/**
 * Called when track audio ends. See handleEnd().
 */
function endVisualizations(){
    pauseVisualizations();
    gl.clearColor(0, 0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

