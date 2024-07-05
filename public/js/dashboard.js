document.addEventListener('DOMContentLoaded', async function() {
    try {
        const usuariosDados = await carregarDados('usuarios');
        const perfisDados = await carregarDados('perfis');
        const modulosDados = await carregarDados('modulos');
        const transacoesDados = await carregarDados('transacoes');
        const funcoesDados = await carregarDados('funcoes');

        // Verifica se os dados foram carregados corretamente
        const usuariosCount = usuariosDados.length;
        const perfisCount = perfisDados.length;
        const modulosCount = modulosDados.length;
        const transacoesCount = transacoesDados.length;
        const funcoesCount = funcoesDados.length;

        const response = await fetch('/api/gerarRelatorios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuariosCount: usuariosCount,
                perfisCount: perfisCount,
                modulosCount: modulosCount,
                transacoesCount: transacoesCount,
                funcoesCount: funcoesCount,

                usuariosDados: usuariosDados,
                perfisDados: perfisDados,
                modulosDados: modulosDados,
                transacoesDados: transacoesDados,
                funcoesDados: funcoesDados,
            }),
        });

        if (!response.ok) {
            throw new Error('Erro ao gerar gráfico');
        }

        // Atualiza a imagem do gráfico após o processamento
        atualizarImagemGrafico();
    } catch (error) {
        console.error('Erro ao gerar gráfico:', error.message);
    }
});

// Exemplo de código para atualizar a imagem após gerar o gráfico
const atualizarImagemGrafico = () => {
    const imgPizzaElement = document.getElementById('graficoPizza');
    imgPizzaElement.src = '/img/grafico_pizza.png?' + new Date().getTime(); // Adiciona um timestamp para evitar cache

    const imgBarrasElement = document.getElementById('graficoBarras')
    imgBarrasElement.src = '/img/grafico_barras.png?' + new Date().getTime();
};

async function carregarDados(tabela) {
    try {
        const response = await fetch(`/api/${tabela}`);
        if (!response.ok) {
            throw new Error(`Falha ao carregar ${tabela}: ` + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Erro ao carregar ${tabela}:`, error);
        alert(`Não foi possível carregar as ${tabela}.`);
        return []; // Retorna um array vazio em caso de erro
    }
}

document.getElementById('downloadXlsx').addEventListener('click', function(event){
    event.preventDefault();
    fetch('/download')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao baixar o arquivo');
        }
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dados.xlsx';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    })
    .catch(error => {
        console.error('Erro durante o download:', error);
        alert('Não foi possível baixar o arquivo.');
    });
});
