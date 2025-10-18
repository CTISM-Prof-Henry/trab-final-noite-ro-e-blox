import { SistemaAgendamento } from './agendamento-definitions.js';

// Elementos da página
const divVisualizacao = document.getElementById('div-visualizacao-salas');
const divCadastro = document.getElementById('div-cadastro-sala');
const gridSalas = document.getElementById('grid-salas'); // Nosso novo container de cards

/**
 * FUNÇÃO ATUALIZADA: Agora cria CARDS em vez de uma tabela.
 */
function atualizarListaSalas() {
    // Limpa o grid antes de preencher
    gridSalas.innerHTML = '';

    if (window.sistema.salas.length === 0) {
        gridSalas.innerHTML = `<div class="col-12"><p class="text-center text-muted">Nenhuma sala cadastrada. Clique em "Adicionar sala" para começar.</p></div>`;
        return;
    }

    window.sistema.salas.forEach(sala => {
        // Cria um elemento de coluna do Bootstrap para o card
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 mb-4';

        // Cria o conteúdo HTML do card usando os dados da sala
        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${sala.nome}</h5>
                    <div class="mb-2">
                        <span class="badge bg-light text-dark border">${sala.tipo}</span>
                    </div>
                    <p class="card-text text-muted mt-auto">Capacidade: ${sala.capacidade} alunos</p>
                </div>
            </div>
        `;
        
        // Adiciona a coluna (com o card dentro) ao grid
        gridSalas.appendChild(col);
    });
}

/**
 * Esconde a visualização e mostra o formulário de cadastro. (NÃO MUDA)
 */
function mostrarFormularioCadastro() {
    divVisualizacao.classList.add('d-none');
    divCadastro.classList.remove('d-none');
}

/**
 * Esconde o formulário de cadastro e mostra a visualização. (NÃO MUDA)
 */
function mostrarVisualizacao() {
    divCadastro.classList.add('d-none');
    divVisualizacao.classList.remove('d-none');
    document.getElementById('form-cadastro-sala').reset(); // Limpa o formulário
}

/**
 * Callback para o botão de cadastrar sala. (NÃO MUDA)
 */
function callbackCadastrarSala() {
    const nome = document.getElementById('input-nome-sala').value;
    const tipo = document.getElementById('select-tipo-ambiente').value;
    const capacidade = parseInt(document.getElementById('input-capacidade').value);
    const divMensagem = document.getElementById('div-mensagem-cadastro');

    try {
        window.sistema.adicionarSala(nome, tipo, capacidade);
        
        atualizarListaSalas();
        mostrarVisualizacao();

    } catch (e) {
        divMensagem.innerHTML = `<div class="alert alert-danger">${e.message}</div>`;
    }
}


/**
 * Função principal (NÃO MUDA)
 */
function main() {
    window.sistema = new SistemaAgendamento();
    window.sistema.carregarDoLocalStorage();

    atualizarListaSalas();

    // Adiciona os eventos aos botões
    document.getElementById('btn-adicionar-nova').addEventListener('click', mostrarFormularioCadastro);
    document.getElementById('btn-voltar-visualizacao').addEventListener('click', mostrarVisualizacao);
    document.getElementById('button-cadastrar').addEventListener('click', callbackCadastrarSala);
}

main();