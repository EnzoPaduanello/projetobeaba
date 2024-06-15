const modulos = JSON.parse(localStorage.getItem('modulos'))
const perfis = JSON.parse(localStorage.getItem('perfis')) || [];
let modul = [];

document.getElementById("cadastroPerfilForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("nameInput").value;
    const nameUpperCase = name.toUpperCase();

    if (name === ""){
        exibirMensagem("Preencha todos os campos")
    }
    else{
        modul = lerCheckboxes()

        const perfil = {
            name: nameUpperCase,
            modulos: modul,
        };

        perfis.push(perfil);

        localStorage.setItem('perfis', JSON.stringify(perfis))

        document.getElementById("nameInput").value = "";
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach(function(checkbox) {
            checkbox.checked = false;
        });

        exibirMensagem("Perfil cadastrado com sucesso")
        console.log(localStorage)
        
        window.location.assign('../gerenciamento/gerenciamentoPerfis.html')
    }
});

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

criarCheckbox()
console.log(localStorage)
