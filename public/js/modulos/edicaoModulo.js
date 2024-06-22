const modulos = JSON.parse(localStorage.getItem('modulos')) || []
const transacoes = JSON.parse(localStorage.getItem('transacoes')) || []
const funcoes = JSON.parse(localStorage.getItem('funcoes')) || []

function getParametroUrl(name) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(name);
};

const valor = getParametroUrl('valor')
console.log(valor)
console.log(modulos)

function preencherCampos(){
    criarCheckbox()

    const checkboxesTransacao = document.querySelectorAll('.checkboxes-transacao');
    const checkboxesFuncao = document.querySelectorAll('.checkboxes-funcao')

    modulos[valor].transacoes.forEach(transacao => {
        checkboxesTransacao.forEach(checkbox => {
        
            if (checkbox.value === transacao) {
                checkbox.checked = true;
            }
        });
    })

    modulos[valor].funcoes.forEach(funcao => {
        checkboxesFuncao.forEach(checkbox => {
        
            if (checkbox.value === funcao) {
                checkbox.checked = true;
            }
        });
    })

    document.getElementById("nameInput").value = modulos[valor].name;
};

function criarCheckbox(){
    const transacaoDiv = document.getElementById('checkbox-tansacoes');
    if (transacoes !== null) {
        
        transacoes.forEach(function(transacao) {
            if(transacao.name !== undefined){
                const novoCheckbox = '<label><input type="checkbox" class="checkboxes-transacao" id="' + transacao.name + '-checkbox" value="' + transacao.name +'">'+transacao.name+'</input><label>';
                transacaoDiv.insertAdjacentHTML('beforeend', novoCheckbox);
            }
        });
            
    } else {
        console.log('Não há transações armazenadas no localStorage.');
    }

    const funcaoDiv = document.getElementById('checkbox-funcoes');
    if (funcoes !== null) {

        funcoes.forEach(function(funcao) {
            if (funcao.name !== undefined) {
                const novoCheckbox = '<label><input type="checkbox" class="checkboxes-funcao" id="' + funcao.name + '-checkbox" value="' + funcao.name +'">'+funcao.name+'</input><label>';
                funcaoDiv.insertAdjacentHTML('beforeend', novoCheckbox);
            }
        });
    } 
    else {
        console.log('Não há transações armazenadas no localStorage.');
    }
}

document.getElementById('edicao-modulo-button').addEventListener('click', function(event){
    event.preventDefault()

    const funcoesCheckbox = lerCheckboxes(1)
    const transacoesCheckbox = lerCheckboxes(2) 

    console.log(funcoesCheckbox)
    console.log(transacoesCheckbox)

    const name = document.getElementById('nameInput').value;
    const nameUpperCase = name.toUpperCase();

    modulos[valor] = {
        name: nameUpperCase,
        funcoes: funcoesCheckbox,
        transacoes: transacoesCheckbox
    }

    localStorage.setItem('modulos', JSON.stringify(modulos))

    exibirMensagem('Módulo editado com sucesso')

    window.location.assign('../gerenciamento/gerenciamentoModulos.html')
})

function lerCheckboxes(numero){
    let checkboxes

    if(numero === 1){
        checkboxes = document.querySelectorAll('.checkboxes-funcao');
             valoresSelecionados = [];

            checkboxes.forEach(function(checkbox) {
                if (checkbox.checked) {
                    valoresSelecionados.push(checkbox.value);
                }
            });

            return valoresSelecionados
    }

    else if(numero ===2){
        checkboxes = document.querySelectorAll('.checkboxes-transacao');
             valoresSelecionados = [];

            checkboxes.forEach(function(checkbox) {
                if (checkbox.checked) {
                    valoresSelecionados.push(checkbox.value);
                }
            });

            return valoresSelecionados
    }
    
}

document.getElementById('exclusao-button').addEventListener('click', function(event){
    event.preventDefault();

    modulos[valor] = {
        name: undefined,
        funcoes: undefined,
        transacoes: undefined
    }

    localStorage.setItem('modulos', JSON.stringify(modulos));

    exibirMensagem("Módulo excluido com sucesso")
    window.location.assign('../gerenciamento/gerenciamentoModulos.html');
});

function exibirMensagem(mensagem) {
    const mensagemDiv = document.getElementById("mensagem");
    mensagemDiv.textContent = mensagem;
    setTimeout(() => {
        mensagemDiv.textContent = "";
    }, 3000); 
}

preencherCampos()