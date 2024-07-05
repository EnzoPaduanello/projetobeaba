const usuario = JSON.parse(localStorage.getItem('usuario'))
const token = JSON.parse(localStorage.getItem('tokenRecuperacao'))
console.log(usuario)
console.log(token)

document.addEventListener('DOMContentLoaded', function() {
    const tokenEmail = getParametroUrl('token')
    console.log('Token URL: ' + tokenEmail)

    document.getElementById('recuperarSenhaButton').addEventListener('click', function(event) {
        event.preventDefault();

        const password = document.getElementById("passwordInput").value;
        const passwordConfirm = document.getElementById("passwordConfirmInput").value;

        console.log(password, passwordConfirm)

        if(password === passwordConfirm){
            console.log('os campos correspondem')

            if(tokenEmail === token.token) {
                console.log('Os tokens correspondem')
                
                const usuarioData = {
                    password: password
                };
    
                fetch(`/api/usuarios/recuperarSenha/${usuario.idUsuario}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(usuarioData)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Falha na requisição: ' + response.statusText);  // Lança um erro se a resposta não for OK
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        localStorage.clear()
                        alert('Senha editada com sucesso')
                        window.location.assign('/login');
                    } else {
                        alert('Falha no cadastro: ' + data.message);  // Mostra uma mensagem de erro se não for bem-sucedido
                    }
                })
                .catch(error => {
                    console.error('Erro:', error);
                    alert('Falha no cadastro: ' + error.message);  // Mostra uma mensagem de erro em caso de falha na requisição
                }); 
            }
        }else {
            
        }

        
    });
});

function getParametroUrl(token) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(token);
};