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

        try {
            // 1. Garante que o ID da sala (que pode ter sido salvo como string) seja tratado como número.
            const idSalaNumerico = parseInt(agendamento.id_sala);

            // 2. Tenta obter a sala no sistema. Se não existir, o .getSala lança um erro.
            const sala = window.sistema.getSala(idSalaNumerico);
            salaNome = sala.nome;
        } catch (e) {
            // Se der erro (ex: sala não encontrada), mantém o valor padrão 'Sala não encontrada'.
            console.warn(`Aviso: Sala ID ${agendamento.id_sala} não encontrada no sistema de salas.`, e);
        }

        const diaFormatado = formatarDiaSemana(agendamento.dia_semana);

        listaContainer.innerHTML += `
            <div class="card h-100 mb-3 my-3">
            <div class="card-body">
                <h5 class="card-title">${salaNome}</h6>
                <p class="mb-2">Prof. ${agendamento.nome_responsavel}</p>
                <p class="card-text text-muted mb-2"> ${agendamento.data_inicio.toLocaleDateString()} - ${agendamento.data_fim.toLocaleDateString()}</p>
                <p class="card-text text-muted mb-0">${diaFormatado} • ${agendamento.hora_inicio} às ${agendamento.hora_fim}</p>
            </div>
        `;
    });
}

function main() {
    window.sistema = new SistemaAgendamento();
    const dadosString = localStorage.getItem('sistemaAgendamento');
    if (dadosString) {
        window.sistema.carregarDados(JSON.parse(dadosString));
    }
    carregarListaAgendamentos();
}

main();