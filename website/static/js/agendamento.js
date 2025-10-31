import { SistemaAgendamento } from './agendamento-definitions.js';

const listaContainer = document.getElementById('lista-agendamentos');

function formatarDiaSemana(diaNum) {
    const num = parseInt(diaNum);
    switch (num) {
        case 0: return 'Domingo';
        case 1: return 'Segunda-feira';
        case 2: return 'Terça-feira';
        case 3: return 'Quarta-feira';
        case 4: return 'Quinta-feira';
        case 5: return 'Sexta-feira';
        case 6: return 'Sábado';
        case -1: return 'Todos os dias';
        default: return 'Dia';
    }
}

//Carrega todos os agendamentos do sistema e os exibe na tela.
function carregarListaAgendamentos() {
    listaContainer.innerHTML = '';
    const agendamentos = window.sistema.agendamentos;

    if (agendamentos.length === 0) {
        listaContainer.innerHTML = '<p class="text-center text-muted">Nenhum agendamento realizado ainda.</p>';
        return;
    }

    // Ordena por data de início (mais recentes primeiro)
    agendamentos.sort((a, b) => b.data_inicio - a.data_inicio);

    agendamentos.forEach((agendamento) => {
        let salaNome = 'Sala não encontrada';
        const diaFormatado = formatarDiaSemana(agendamento.dia_semana);

        listaContainer.innerHTML += `
            <div class="card h-100 mb-3 my-3">
            <div class="card-body">
                <h5 class="card-title">${salaNome}</h6>
                <p class="mb-2">Prof. ${agendamento.nome_responsavel}</p>
                <p class="card-text text-muted mb-0">${diaFormatado} • ${agendamento.hora_inicio} às ${agendamento.hora_fim}</p>
            </div>
        `;
    });
}

function main() {
    window.sistema = new SistemaAgendamento();
    window.sistema.carregarDoLocalStorage();
    carregarListaAgendamentos();
}

main();