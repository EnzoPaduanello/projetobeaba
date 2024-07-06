function autenticar() {
    const token = localStorage.getItem('tokenAuth'); // Obtém o token do localStorage
    console.log(token)

    if (!token || token === null) {
        window.location.href = '/login'; // Redireciona para o login se o token não estiver presente ou for inválido
    } else {
        console.log('Login autenticado');
    }
};

autenticar()