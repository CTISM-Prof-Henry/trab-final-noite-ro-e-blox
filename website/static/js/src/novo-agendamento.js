import { SistemaAgendamento } from './agendamento-definitions.js';

function popularSelectSalas() {
    const selectSala = document.getElementById('select-sala');
    selectSala.length = 1;
    window.sistema.salas.forEach(sala => {
        const option = document.createElement('option');
        option.value = sala.id_sala;
        option.textContent = sala.nome;
        selectSala.appendChild(option);
    });
}

function callbackAdicionarAgendamento() {
    const id_sala = parseInt(document.getElementById('select-sala').value);
    const nome_responsavel = document.getElementById('input-responsavel').value;
    const hora_inicio = document.getElementById('input-hora-inicio').value;
    const hora_fim = document.getElementById('input-hora-fim').value;

    const dia_semana = parseInt(document.getElementById('select-dia-semana').value);
    const dateRangePicker = $('#daterange').data('daterangepicker');
    const data_inicio = dateRangePicker.startDate.toDate();
    const data_fim = dateRangePicker.endDate.toDate();

    const divMensagem = document.getElementById('div-mensagem');

    try {
        window.sistema.adicionarAgendamento(id_sala, nome_responsavel, data_inicio, data_fim, hora_inicio, hora_fim, dia_semana);
        localStorage.setItem('sistemaAgendamento', JSON.stringify(window.sistema));
        divMensagem.innerHTML = `<div class="alert alert-success" role="alert">Agendamento realizado com sucesso!</div>`;
        document.getElementById('form-agendamento').reset();
        $('#daterange').val('');
    } catch (e) {
        divMensagem.innerHTML = `<div class="alert alert-danger" role="alert"><strong>Erro:</strong> ${e.message}</div>`;
    }
}

function main() {
    window.sistema = new SistemaAgendamento();
    
    const dadosString = localStorage.getItem('sistemaAgendamento');
    if (dadosString) {
        window.sistema.carregarDados(JSON.parse(dadosString));
    }
    popularSelectSalas();

    document.getElementById('button-confirmar').addEventListener('click', callbackAdicionarAgendamento);
}

main();