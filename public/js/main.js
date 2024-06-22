document.getElementById('usuarios').addEventListener('click', function(event){
    event.preventDefault();

    window.location.href = '/usuarios/cadastro'
});

document.getElementById('perfis').addEventListener('click', function(event){
    event.preventDefault();

    window.location.href = '../gerenciamento/gerenciamentoPerfis.html'
});

document.getElementById('transacoes').addEventListener('click', function(event){
    event.preventDefault();

    window.location.href = '../gerenciamento/gerenciamentoTransacoes.html'
});

document.getElementById('modulos').addEventListener('click', function(event){
    event.preventDefault();

    window.location.href = '../gerenciamento/gerenciamentoModulos.html'
});

document.getElementById('funcoes').addEventListener('click', function(event){
    event.preventDefault();

    window.location.href = '../gerenciamento/gerenciamentoFuncoes.html'
});

document.getElementById('logout').addEventListener('click', function(event){
    event.preventDefault();

    window.location.href = 'login.html'
});