import { SistemaAgendamento } from './agendamento-definitions.js';

const divVisualizacao = document.getElementById('div-visualizacao-salas');
const divCadastro = document.getElementById('div-cadastro-sala');
const gridSalas = document.getElementById('grid-salas'); 

function atualizarListaSalas() {
    gridSalas.innerHTML = '';

    if (window.sistema.salas.length === 0) {
        gridSalas.innerHTML = `<div class="col-12"><p class="text-center text-muted">Nenhuma sala cadastrada. Clique em "+ Adicionar sala" para começar.</p></div>`;
        return;
    }

    window.sistema.salas.forEach(sala => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 mb-4';

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
        
        gridSalas.appendChild(col);
    });
}

function mostrarFormularioCadastro() {
    divVisualizacao.classList.add('d-none');
    divCadastro.classList.remove('d-none');
}

function mostrarVisualizacao() {
    divCadastro.classList.add('d-none');
    divVisualizacao.classList.remove('d-none');
    document.getElementById('form-cadastro-sala').reset();
}

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

function main() {
    window.sistema = new SistemaAgendamento();
    window.sistema.carregarDoLocalStorage();

    atualizarListaSalas();

    document.getElementById('btn-adicionar-nova').addEventListener('click', mostrarFormularioCadastro);
    document.getElementById('btn-voltar-visualizacao').addEventListener('click', mostrarVisualizacao);
    document.getElementById('button-cadastrar').addEventListener('click', callbackCadastrarSala);
}

main();