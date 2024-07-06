document.getElementById('recuperarForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const matricula = document.getElementById('matriculaInput').value;

    try {
        const response = await fetch(`/api/usuarios/esqueciASenha/${matricula}`);
        if (!response.ok) {
            throw new Error('Falha ao carregar usuário: ' + response.statusText);
        }
        const data = await response.json();

        const token = generateRandomToken(9);
        const enviarEmailResponse = await enviarEmail(data.email, token);

        if (enviarEmailResponse.success) {
            alert('Email enviado com sucesso!');

            const usuarioData = data
            localStorage.setItem('usuario', JSON.stringify(usuarioData))

            const tokenLocalStorage = { token: token }
            localStorage.setItem('tokenRecuperacao', JSON.stringify(tokenLocalStorage))
        } else {
            throw new Error('Erro ao enviar email: ' + enviarEmailResponse.message);
        }
    } catch (error) {
        console.error('Erro ao recuperar usuário ou enviar email:', error);
        alert('Não foi possível recuperar o usuário ou enviar o email.');
    }
});

async function enviarEmail(toEmail, token) {
    try {
        const enviarEmailResponse = await fetch('/api/esqueciASenha/enviarEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subject: 'Recuperação de Senha',
                body: `Olá, aqui está o link para recuperar sua senha\n
                    http://192.168.0.57:3000/recuperarSenha?token=${token}`,
                toEmail: toEmail
            })
        });

        if (!enviarEmailResponse.ok) {
            const errorData = await enviarEmailResponse.json();
            throw new Error('Erro ao enviar email: ' + errorData.message);
        }

        return { success: true };
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        return { success: false, message: error.message };
    }
}

function generateRandomToken(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        token += charset[randomIndex];
    }
    return token;
}
