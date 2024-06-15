const modulos = JSON.parse(localStorage.getItem('modulos')) || [];

function criarListaModulos(modulos) {
    const divLista = document.getElementById('list-div');
    
    while (divLista.querySelector('a')) {
        divLista.querySelector('a').remove();
    }

    modulos.forEach((modulo, i) => {
        if (modulo.name === undefined){

        }

        else{
            const aElement = document.createElement('a')
            aElement.href = '../edicao/edicaoModulo.html?valor=' + i

            const ulElement = document.createElement('ul');
            ulElement.id = i;
            ulElement.className = 'modulo-list';

            const lNome = document.createElement('li');
            const lTransacoes = document.createElement('li');
            const lFuncoes = document.createElement('li');

            lNome.textContent = 'Nome: ' + modulo.name;

            if(modulo.transacoes == undefined || modulo.transacoes.length === 0){
                lTransacoes.textContent = `Transações: Nenhuma transação cadastrada no modulo.`
            }
            
            else{
                lTransacoes.textContent = 'Transações: ' + modulo.transacoes.join(', ');
            }

            if(modulo.funcoes == undefined || modulo.funcoes.length === 0){
                lFuncoes.textContent = `Função: Nenhuma função cadastrada no módulo.`
            }
            else{
                lFuncoes.textContent = 'Função: ' + modulo.funcoes.join(', ');
            }

            ulElement.appendChild(lNome);
            ulElement.appendChild(lTransacoes);
            ulElement.appendChild(lFuncoes);

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
        criarListaModulos(modulos);
    } else {
        const modulosFiltrados = modulos.filter(modulo => 
            modulo.name === pesquisaUpperCase || 
            (modulo.transacoes && modulo.transacoes.includes(pesquisaUpperCase)) || 
            (modulo.funcoes && modulo.funcoes.includes(pesquisaUpperCase))
        );
        criarListaModulos(modulosFiltrados);
    }
});


document.getElementById('cadastrar-modulo').addEventListener('click', function(event){
    event.preventDefault()

    window.location.assign('../cadastro/cadastroModulos.html')
})
criarListaModulos(modulos)
console.log(modulos)