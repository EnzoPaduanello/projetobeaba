const perfis = JSON.parse(localStorage.getItem('perfis'));
const modulos = JSON.parse(localStorage.getItem('modulos'));

function getParametroUrl(name) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(name);
}

const valor = getParametroUrl('valor')
console.log(valor)
console.log(perfis)

function preencherCampos(){
    criarCheckbox()
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    perfis[valor].modulos.forEach(modulo => {
        checkboxes.forEach(checkbox => {
        
            if (checkbox.value === modulo) {
                checkbox.checked = true;
            }
        });
    })

   
    document.getElementById("nameInput").value = perfis[valor].name;
}

function criarCheckbox(){
    const moduloDiv = document.getElementById('checkbox-modulos');
    moduloDiv.innerHTML = '';

    if (modulos !== null) {
        
        modulos.forEach(function(modulo) {
            if (modulo.name !== undefined){
                const novoCheckbox = `<label><input type="checkbox" class="checkboxes-modulo" id="${modulo.name}-checkbox" value="${modulo.name}">${modulo.name}</input><label>`;
                moduloDiv.insertAdjacentHTML('beforeend', novoCheckbox);
            }
            
        });
    } else {
        console.log('Não há módulos armazenadas no localStorage.');
    }
}

document.getElementById('edicao-perfil-button').addEventListener('click', function(event){
    event.preventDefault();

    const name = document.getElementById('nameInput').value;
    const nameUpperCase = name.toUpperCase();

    const modul = lerCheckboxes()

    perfis[valor] = {
        name: nameUpperCase,
        modulos: modul
    }

    localStorage.setItem('perfis', JSON.stringify(perfis))

    exibirMensagem('Perfil editado com sucesso')
    window.location.assign('../gerenciamento/gerenciamentoPerfis.html');
})

document.getElementById('exclusao-button').addEventListener('click', function(event){
    event.preventDefault();

    perfis[valor] = {
        name: undefined,
        modulos: undefined
    }

    localStorage.setItem('perfis', JSON.stringify(perfis));

    exibirMensagem("Perfil excluido com sucesso")
    window.location.assign('../gerenciamento/gerenciamentoPerfis.html');
});

function lerCheckboxes(){
    
    var checkboxes = document.querySelectorAll('.checkboxes-modulo');
            valoresSelecionados = [];

        checkboxes.forEach(function(checkbox) {
            if (checkbox.checked) {
                valoresSelecionados.push(checkbox.value);
            }
        });

        return valoresSelecionados 
}

function exibirMensagem(mensagem) {
    const mensagemDiv = document.getElementById("mensagem");
    mensagemDiv.textContent = mensagem;
    setTimeout(() => {
        mensagemDiv.textContent = "";
    }, 3000); 
}

preencherCampos();