document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio do formulário

    const login = document.getElementById('loginInput').value;
    const password = document.getElementById('senhaInput').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST', // Use POST em vez de GET para enviar credenciais de login
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login, password })
        });

        const result = await response.json();

        const messageDiv = document.getElementById('mensagem');
        if (response.ok) {
            messageDiv.textContent = 'Login bem-sucedido!';

            const tokenLocalStorage = { token: 'QQTech6@2024#' }
            localStorage.setItem('tokenAuth', JSON.stringify(tokenLocalStorage))

            window.location.href = '/'
        } else {
            messageDiv.textContent = result.message;
        }
    } catch (error) {
        console.error('Erro:', error);
        const messageDiv = document.getElementById('mensagem');
        messageDiv.textContent = 'Erro ao fazer login. Tente novamente mais tarde.';
    }
});
