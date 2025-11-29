import { SistemaAgendamento } from './agendamento-definitions.js';

function formatarDataISO(data, hora) {
    const [horas, minutos] = hora.split(':');
    const dataISO = new Date(data.getFullYear(), data.getMonth(), data.getDate(), horas, minutos);
    return dataISO;
}

/**
 * Processa agendamentos (com recorrência) e coloca
 * em eventos individuais para o FullCalendar.
 */
function processarAgendamentosParaCalendario(sistema) {
    const eventosCalendario = [];
    const agendamentos = sistema.agendamentos;

    agendamentos.forEach(ag => {
        let salaNome = 'Sala';
        let salaTipo = 'outro';
        try {
            const sala = sistema.getSala(ag.id_sala);
            salaNome = sala.nome;
            salaTipo = sala.tipo.toLowerCase().includes('laboratório') ? 'lab' : (sala.tipo.toLowerCase().includes('sala') ? 'sala' : 'outro');
        } catch (e) {
            console.warn(e.message);
        }

        const tituloEvento = `${salaNome}: ${ag.nome_responsavel}`;
        const diaSemanaAgendado = parseInt(ag.dia_semana);

        let dataAtual = new Date(ag.data_inicio);
        const dataFim = new Date(ag.data_fim);

        while (dataAtual <= dataFim) {
            const diaDaSemanaAtual = dataAtual.getDay();

            // Verifica se o dia atual bate com o dia agendado
            // (ou se o agendamento é para "Todos os dias")
            if (diaSemanaAgendado === -1 || diaSemanaAgendado === diaDaSemanaAtual) {

                // Criamos um evento para este dia específico
                eventosCalendario.push({
                    title: tituloEvento,
                    start: formatarDataISO(dataAtual, ag.hora_inicio),
                    end: formatarDataISO(dataAtual, ag.hora_fim),
                    extendedProps: {
                        tipo: salaTipo
                    }
                });
            }

            // Avança para o próximo dia
            dataAtual.setDate(dataAtual.getDate() + 1);
        }
    });

    return eventosCalendario;
}

function main() {
    window.sistema = new SistemaAgendamento();
    const dadosString = localStorage.getItem('sistemaAgendamento');
    if (dadosString) {
        window.sistema.carregarDados(JSON.parse(dadosString));
    }

    const eventos = processarAgendamentosParaCalendario(window.sistema);

    const calendarEl = document.getElementById('calendar');

    const calendar = new FullCalendar.Calendar(calendarEl, {

        themeSystem: 'bootstrap5',

        allDaySlot: false,

        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        initialView: 'dayGridMonth',

        locale: 'pt-br',
        buttonText: {
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia'
        },

        events: eventos,

        eventClassNames: function (arg) {
            const tipo = arg.event.extendedProps.tipo;
            if (tipo === 'lab') return ['evento-lab'];
            if (tipo === 'sala') return ['evento-sala'];
            return ['evento-outro'];
        }
    });

    calendar.render();
}

document.addEventListener('DOMContentLoaded', main);