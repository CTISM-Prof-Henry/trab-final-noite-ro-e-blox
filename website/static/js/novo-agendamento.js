import { SistemaAgendamento } from './agendamento-definitions.js';

/**
 * Função para popular o <select> de salas dinamicamente.
 */
function popularSelectSalas() {
    const selectSala = document.getElementById('select-sala');
    // Limpa opções antigas, exceto a primeira ("Selecione uma sala")
    selectSala.length = 1;

    // Pega as salas do nosso sistema e cria um <option> para cada uma
    window.sistema.salas.forEach(sala => {
        const option = document.createElement('option');
        option.value = sala.id_sala;
        option.textContent = sala.nome;
        selectSala.appendChild(option);
    });
}

/**
 * Callback que é executado quando o botão de confirmar é clicado.
 */
function callbackAdicionarAgendamento() {
    // 1. Obter os dados do formulário
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
        // 2. Tentar adicionar o agendamento no sistema (com o novo parâmetro)
        window.sistema.adicionarAgendamento(id_sala, nome_responsavel, data_inicio, data_fim, hora_inicio, hora_fim, dia_semana);

        // 3. Mostrar feedback de sucesso
        divMensagem.innerHTML = `<div class="alert alert-success" role="alert">Agendamento realizado com sucesso!</div>`;
        document.getElementById('form-agendamento').reset();
        
        console.log('Agendamentos atuais:', window.sistema.agendamentos);

    } catch (e) {
        // 4. Mostrar feedback de erro
        divMensagem.innerHTML = `<div class="alert alert-danger" role="alert"><strong>Erro:</strong> ${e.message}</div>`;
    }
}


/**
 * Função principal que inicializa o sistema.
 */
function main() {
    // Cria uma instância global do nosso sistema
    window.sistema = new SistemaAgendamento();
    window.sistema.carregarDoLocalStorage();

    // Se não houver nenhuma sala carregada, adiciona as de exemplo (só na primeira vez)
    if (window.sistema.salas.length === 0) {
        console.log("Nenhuma sala encontrada. Adicionando salas padrão.");
        window.sistema.adicionarSala('Sala 201 - Auditório', 'Auditório', 100);
        window.sistema.adicionarSala('Sala 305 - Laboratório de Redes', 'Laboratório', 40);
        window.sistema.adicionarSala('Sala 410 - Sala de Reuniões', 'Sala de Reuniões', 15);
    }
    
    // Mostra as salas cadastradas no select do HTML
    popularSelectSalas();

    // Adiciona o evento de clique ao botão de confirmar
    document.getElementById('button-confirmar').addEventListener('click', callbackAdicionarAgendamento);
}

// Inicia o programa
main();