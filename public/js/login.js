const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const login = document.getElementById('loginInput').value;
    const password = document.getElementById('senhaInput').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login, password })
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('tokenAuth', result.token); // Armazena o token recebido como uma string
            window.location.href = '/'; // Redireciona para a página principal
        } else {
            const messageDiv = document.getElementById('mensagem');
            messageDiv.textContent = result.message;
        }
    } catch (error) {
        console.error('Erro:', error);
        const messageDiv = document.getElementById('mensagem');
        messageDiv.textContent = 'Erro ao fazer login. Tente novamente mais tarde.';
    }
});
