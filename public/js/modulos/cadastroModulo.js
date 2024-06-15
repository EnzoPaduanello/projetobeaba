const modulos = JSON.parse(localStorage.getItem('modulos')) || [];
const transacoesArray = JSON.parse(localStorage.getItem('transacoes'));
const funcoesArray = JSON.parse(localStorage.getItem('funcoes'));
let funcoes = [];
let transacoes = [];

document.getElementById("cadastroModuloForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("nameInput").value;
    const nameUpperCase = name.toUpperCase();

    if (name === ""){
        exibirMensagem("Preencha todos os campos")
    }
    else{
        funcoes = lerCheckboxes(1)
        transacoes = lerCheckboxes(2) 

        const modulo = {
            name: nameUpperCase,
            funcoes: funcoes,
            transacoes: transacoes
        };

        modulos.push(modulo);

        localStorage.setItem('modulos', JSON.stringify(modulos))

        document.getElementById("nameInput").value = "";

        exibirMensagem("Módulo cadastrado com sucesso")
        console.log(localStorage)
        
        window.location.assign('../gerenciamento/gerenciamentoModulos.html')
    }
});

function criarCheckbox(){
    const transacaoDiv = document.getElementById('checkbox-tansacoes');
    if (transacoesArray !== null) {
        
        transacoesArray.forEach(function(transacao) {
            if(transacao.name !== undefined){
                const novoCheckbox = '<label><input type="checkbox" class="checkboxes-transacao" id="' + transacao.name + '-checkbox" value="' + transacao.name +'">'+transacao.name+'</input><label>';
                transacaoDiv.insertAdjacentHTML('beforeend', novoCheckbox);
            }
        });
            
    } else {
        console.log('Não há transações armazenadas no localStorage.');
    }

    const funcaoDiv = document.getElementById('checkbox-funcoes');
    if (funcoesArray !== null) {

        funcoesArray.forEach(function(funcao) {
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

function lerCheckboxes(numero){
    
    if(numero === 1){
        const checkboxes = document.querySelectorAll('.checkboxes-funcao');
             valoresSelecionados = [];

            checkboxes.forEach(function(checkbox) {
                if (checkbox.checked) {
                    valoresSelecionados.push(checkbox.value);
                }
            });

            return valoresSelecionados
    }

    else if(numero ===2){
        const checkboxes = document.querySelectorAll('.checkboxes-transacao');
             valoresSelecionados = [];

            checkboxes.forEach(function(checkbox) {
                if (checkbox.checked) {
                    valoresSelecionados.push(checkbox.value);
                }
            });

            return valoresSelecionados
    }
    
}

function exibirMensagem(mensagem) {
    const mensagemDiv = document.getElementById("mensagem");
    mensagemDiv.textContent = mensagem;
    setTimeout(() => {
        mensagemDiv.textContent = "";
    }, 3000); 
}

criarCheckbox()
console.log(localStorage)