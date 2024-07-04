import sys
import os
import matplotlib.pyplot as plt
import json
import pandas as pd
import numpy as np

def gerar_grafico(usuariosCount, perfisCount, modulosCount, transacoesCount, funcoesCount):
    caminho_arquivo = 'public/img/grafico_pizza.png'
    if os.path.exists(caminho_arquivo):
        os.remove(caminho_arquivo)
        print(f"Arquivo '{caminho_arquivo}' existente foi removido.")

    # Dados para o gráfico
    labels = ['Usuários', 'Perfis', 'Módulos', 'Transações', 'Funções']
    sizes = [usuariosCount, perfisCount, modulosCount, transacoesCount, funcoesCount]
    colors = ['red', 'darkgray', 'brown', 'darkgreen', 'darkblue']

    # Cria o gráfico de pizza com fundo transparente
    fig, ax = plt.subplots(figsize=(8, 8), facecolor='none')  # 'none' torna o fundo transparente
    patches, texts, autotexts = ax.pie(sizes, labels=labels, colors=colors, autopct='%1.1f%%', startangle=140)

    # Define a cor e o tamanho da fonte dos números como branco e 12 respectivamente
    for autotext, size in zip(autotexts, sizes):
        autotext.set_color('white')
        autotext.set_fontsize(12)
        autotext.set_fontweight('bold')  # Define o texto em negrito

        # Adiciona a quantidade exata entre parênteses abaixo da porcentagem
        x, y = autotext.get_position()
        ax.annotate(f'({size})', (x, y - 0.1), color='white', fontsize=10, ha='center', va='center', fontweight='bold')

    for text in texts:
        text.set_fontsize(14)
        text.set_fontweight('bold')

    # Título em negrito e tamanho maior
    plt.title('Quantidade de Cadastros', fontsize=16, fontweight='bold')

    # Salva o gráfico como imagem PNG
    plt.savefig(caminho_arquivo, transparent=True)

    # Fecha a plotagem (limpa a memória)
    plt.close()

    print('Gráfico gerado com sucesso.')

    gerar_grafico_barras(usuariosCount, perfisCount, modulosCount, transacoesCount, funcoesCount)
    gerar_xlsx()


def gerar_xlsx():
    try:
        # Lendo dados dos arquivos JSON existentes
        with open('public/arquivosRelatorios/json/usuarios.json', 'r') as file:
            usuarios = json.load(file)

        with open('public/arquivosRelatorios/json/perfis.json', 'r') as file:
            perfis = json.load(file)

        with open('public/arquivosRelatorios/json/modulos.json', 'r') as file:
            modulos = json.load(file)

        with open('public/arquivosRelatorios/json/transacoes.json', 'r') as file:
            transacoes = json.load(file)

        with open('public/arquivosRelatorios/json/funcoes.json', 'r') as file:
            funcoes = json.load(file)

        # Criando arquivo Excel com múltiplas planilhas
        with pd.ExcelWriter('dados.xlsx') as writer:
            pd.DataFrame(usuarios).to_excel(writer, sheet_name='Usuarios', index=False)
            pd.DataFrame(perfis).to_excel(writer, sheet_name='Perfis', index=False)
            pd.DataFrame(modulos).to_excel(writer, sheet_name='Modulos', index=False)
            pd.DataFrame(transacoes).to_excel(writer, sheet_name='Transacoes', index=False)
            pd.DataFrame(funcoes).to_excel(writer, sheet_name='Funcoes', index=False)

        print("Arquivos JSON lidos e Excel criado com sucesso.")

    except FileNotFoundError as e:
        print("Arquivo JSON não encontrado:", e)
    except json.JSONDecodeError as e:
        print("Erro ao decodificar arquivo JSON:", e)


def gerar_grafico_barras(usuariosCount, perfisCount, modulosCount, transacoesCount, funcoesCount):
    caminho_arquivo = 'public/img/grafico_barras.png'
    if os.path.exists(caminho_arquivo):
        os.remove(caminho_arquivo)
        print(f"Arquivo '{caminho_arquivo}' existente foi removido.")

    # Dados para o gráfico de barras
    labels = ['Usuários', 'Perfis', 'Módulos', 'Transações', 'Funções']
    sizes = [usuariosCount, perfisCount, modulosCount, transacoesCount, funcoesCount]
    colors = ['red', 'darkgray', 'brown', 'darkgreen', 'darkblue']

    x = np.arange(len(labels))  # Posições das barras

    # Cria o gráfico de barras
    fig, ax = plt.subplots(figsize=(10, 6))
    bars = ax.bar(x, sizes, color=colors)

    # Adiciona os valores acima das barras
    for bar, size in zip(bars, sizes):
        height = bar.get_height()
        ax.annotate(f'{size}', xy=(bar.get_x() + bar.get_width() / 2, height),
                    xytext=(0, 3), textcoords='offset points',
                    ha='center', va='bottom', fontsize=12, fontweight='bold')

    # Formatação do gráfico
    ax.set_xlabel('Categorias', fontsize=16, fontweight='bold')  # Ajusta tamanho e negrito
    ax.set_ylabel('Quantidade', fontsize=16, fontweight='bold')  # Ajusta tamanho e negrito
    ax.set_title('Quantidade de Cadastros por Categoria', fontsize=20, fontweight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels(labels, rotation=45, fontsize=12, fontweight='bold')  # Ajusta tamanho e negrito
    ax.legend(labels)

    # Salva o gráfico como imagem PNG
    plt.tight_layout()
    plt.savefig(caminho_arquivo, transparent=True)
    plt.close()

    print(f'Gráfico de barras gerado com sucesso em {caminho_arquivo}.')

if __name__ == '__main__':
    # Recebe os argumentos da linha de comando
    _, usuariosCount, perfisCount, modulosCount, transacoesCount, funcoesCount = sys.argv

    # Converte os valores de string para int
    usuarios = int(usuariosCount)
    perfis = int(perfisCount)
    modulos = int(modulosCount)
    transacoes = int(transacoesCount)
    funcoes = int(funcoesCount)

    # Chama a função para gerar o gráfico
    gerar_grafico(usuarios, perfis, modulos, transacoes, funcoes)
