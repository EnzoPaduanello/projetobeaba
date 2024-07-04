document.addEventListener('DOMContentLoaded', function() {
    const tokenLocalStorage = JSON.parse(localStorage.getItem('tokenAuth'));
    console.log(tokenLocalStorage)

    if (tokenLocalStorage === null){
        window.location.href = '/login'
    } else {
        if (tokenLocalStorage.token === 'QQTech6@2024#'){
            console.log('Login autenticado')
        } else {
            window.location.href = '/login'
        }
    } 
});