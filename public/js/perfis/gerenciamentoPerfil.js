const perfis = JSON.parse(localStorage.getItem('perfis')) || [];

function criarListaPerfis(perfis) {
    const divLista = document.getElementById('list-div');
    
    while (divLista.querySelector('a')) {
        divLista.querySelector('a').remove();
    }

    perfis.forEach((perfil, i) => {
        if (perfil.name === undefined || perfil.modulos === undefined){

        }else{
            const aElement = document.createElement('a')
            aElement.href = '../edicao/edicaoPerfil.html?valor=' + i

            const ulElement = document.createElement('ul');
            ulElement.id = i;
            ulElement.className = 'perfil-list';

            const lNome = document.createElement('li');
            const lModulos = document.createElement('li');

            lNome.textContent = 'Nome: ' + perfil.name;
            lModulos.textContent = 'Módulos: ' + perfil.modulos.join(', ');

            ulElement.appendChild(lNome);
            ulElement.appendChild(lModulos);

            aElement.appendChild(ulElement)

            divLista.appendChild(aElement);
        }
        
    });
}

document.getElementById('pesquisa-button').addEventListener('click', function(event) {
    event.preventDefault();
    
    const pesquisa = document.getElementById('pesquisa-input').value;
    const pesquisaUpperCase = pesquisa.toUpperCase();

    if (pesquisaUpperCase === '') {
        criarListaPerfis(perfis);
    } else {
        const perfisFiltrados = perfis.filter(perfil => 
            perfil.name === pesquisaUpperCase || 
            (perfil.modulos && perfil.modulos.includes(pesquisaUpperCase))
        );
        criarListaPerfis(perfisFiltrados);
    }
});


document.getElementById('cadastrar-perfil').addEventListener('click', function(event) {
    event.preventDefault();
    
    window.location.assign('../cadastro/cadastroPerfis.html');
});

criarListaPerfis(perfis)
console.log(perfis)