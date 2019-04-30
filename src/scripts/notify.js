/* ===== Notification Functions ===== */

function notifyUser(message){
    notificationBox.innerHTML = message;
    notificationBox.classList.add('is-fading-in');
    notificationBox.classList.remove('is-fading-out');
    notificationBox.classList.toggle('is-hidden');
    
    setTimeout(() => {        
        notificationBox.classList.remove('is-fading-in');
        notificationBox.classList.add('is-fading-out');      
        setTimeout(() => {
            notificationBox.classList.toggle('is-hidden');
        }, 1000);  
    }, 5000);
}