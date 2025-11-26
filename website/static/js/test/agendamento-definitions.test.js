import { SistemaAgendamento, Agendamento, Responsavel } from "../src/agendamento-definitions.js";

function testaCRUDSala(assert) {
    let sistema = new SistemaAgendamento();

    let nome = 'Sala A101';
    let tipo = 'Sala de Aula';
    let capacidade = 40;

    // 1. Adicionar e verificar a sala
    let novaSala = sistema.adicionarSala(nome, tipo, capacidade);

    assert.equal(novaSala.nome, nome, "Nome da sala deve estar correto");
    assert.equal(sistema.salas.length, 1, "Deve haver 1 sala no array");

    // 2. Testa caso de sucesso getSala
    try {
        const salaRecuperada = sistema.getSala(novaSala.id_sala); 
        // Verifica se a sala foi recuperada e retorna o ID correto
        assert.equal(salaRecuperada.id_sala, novaSala.id_sala, "getSala deve retornar a sala correta (Cobre o 'return sala').");
    } catch (e) {
        // Se cair aqui, o teste falha, pois a sala deveria existir
        assert.ok(false, "getSala não deveria lançar erro para uma sala existente.");
    }

    // 3. Testa erro ao faltar campos (Cobre o 'if (!nome || !tipo || !capacidade)' em adicionarSala)
    assert.throws(
        () => sistema.adicionarSala(null, 'Lab', 20),
        /Todos os campos são obrigatórios/,
        "Deve lançar erro se o nome for nulo."
    );

    // 4. Testa erro ao recuperar sala inexistente (Cobre o 'if (!sala) throw' em getSala)
    assert.throws(
        () => sistema.getSala(999),
        /Sala não encontrada/,
        "Deve lançar erro ao buscar ID inexistente."
    );
}

function testaAdicaoAgendamentoSucesso(assert) {
    let sistema = new SistemaAgendamento();

    let sala = sistema.adicionarSala('Lab 1', 'Laboratório', 20);

    let resp = 'Professor Teste';
    let dataIni = new Date(2025, 9, 10);
    let dataFim = new Date(2025, 9, 20);
    let horaIni = '08:00';
    let horaFim = '10:00';
    let diaSemana = 1;

    let agendamento = sistema.adicionarAgendamento(sala.id_sala, resp, dataIni, dataFim, horaIni, horaFim, diaSemana);

    assert.equal(sistema.agendamentos.length, 1, "Deve ter 1 agendamento");
    assert.ok(agendamento.data_inicio instanceof Date, "A data de início deve ser um objeto Date.");
}

function testaConflitoAgendamento(assert) {
    let sistema = new SistemaAgendamento();
    let sala = sistema.adicionarSala('Auditório', 'Auditório', 100);

    sistema.adicionarAgendamento(
        sala.id_sala,
        'Prof A',
        new Date(2025, 9, 10), new Date(2025, 9, 20),
        '14:00', '16:00',
        5
    );

    // 1. Testa Erro de Campos Vazios
    assert.throws(() => {
        sistema.adicionarAgendamento(null, 'Prof H', new Date(), new Date(), '00:00', '00:00', 5);
    }, /preencha todos os campos obrigatórios/, "Deve lançar erro se faltar ID da sala.");

    // 2. Conflito Total (Mesmo horário, dia e período)
    assert.throws(() => {
        sistema.adicionarAgendamento(
            sala.id_sala, 'Prof B',
            new Date(2025, 9, 10), new Date(2025, 9, 20),
            '14:00', '16:00',
            5
        );
    }, /conflitante/, "Não deve permitir mesmo horário, dia e período.");

    // 3. Conflito de Horário: Começa antes e termina DENTRO do existente.
    assert.throws(() => {
        sistema.adicionarAgendamento(
            sala.id_sala, 'Prof F',
            new Date(2025, 9, 10), new Date(2025, 9, 20),
            '13:00', '14:30', // sobrepõe
            5
        );
    }, /conflitante/, "Não deve permitir sobreposição parcial de horário.");

    // 4. Conflito de Período: Novo engloba o existente. 
    assert.throws(() => {
        sistema.adicionarAgendamento(
            sala.id_sala, 'Prof G',
            new Date(2025, 9, 1), new Date(2025, 9, 30), // Período maior
            '14:00', '16:00',
            5
        );
    }, /conflitante/, "Não deve permitir sobreposição total de período.");


    // 5. Conflito com "Todos os dias" (-1)
    // Tentativa de marcar "Todos os dias" deve falhar, pois a Sexta (5) já está ocupada.
    assert.throws(() => {
        sistema.adicionarAgendamento(
            sala.id_sala, 'Prof E',
            new Date(2025, 9, 10), new Date(2025, 9, 20),
            '14:00', '16:00',
            -1 // Todos os dias
        );
    }, /conflitante/, "Não deve permitir 'Todos os dias' se um dia específico já está ocupado.");

    // 6. Teste de SUCESSO - Dia da semana diferente
    try {
        sistema.adicionarAgendamento(
            sala.id_sala, 'Prof D',
            new Date(2025, 9, 10), new Date(2025, 9, 20),
            '14:00', '16:00',
            4
        );
        assert.ok(true, "Deve permitir agendamento em dia da semana diferente.");
    } catch (e) {
        assert.ok(false, "Falhou ao adicionar dia da semana diferente: " + e.message);
    }
}

function testaCarregarDados(assert) {
    let sistema = new SistemaAgendamento();

    const responsavelTeste = new Responsavel(99, 'Responsavel Teste');
    assert.equal(responsavelTeste.id_responsavel, 99, "Instanciar Responsavel cobre o constructor.");

    const dadosCarregar = {
        salas: [{ id_sala: 10, nome: "Sala X" }],
        agendamentos: [{
            id_agendamento: 20,
            id_sala: 10,
            nome_responsavel: "Carregado",
            data_inicio: "2025-10-01",
            data_fim: "2025-10-05",
            hora_inicio: "10:00",
            hora_fim: "12:00",
            dia_semana: 3
        }],
        responsaveis: [{ id_responsavel: 1, nome: "Resp A" }],
        ultimo_id_sala: 10,
        ultimo_id_agendamento: 20,
        ultimo_id_responsavel: 1
    };

    // 1. Testa o carregamento
    sistema.carregarDados(dadosCarregar);

    assert.equal(sistema.salas.length, 1, "Deve carregar 1 sala.");
    assert.equal(sistema.agendamentos.length, 1, "Deve carregar 1 agendamento.");
    assert.equal(sistema.ultimo_id_agendamento, 20, "O último ID de agendamento deve ser restaurado.");

    // 2. Verifica a reconstrução da classe e do tipo Date
    assert.ok(sistema.agendamentos[0] instanceof Agendamento, "O objeto agendamento deve ser uma instância da classe Agendamento.");
    assert.ok(sistema.agendamentos[0].data_inicio instanceof Date, "A data de início deve ser convertida para objeto Date.");

    // 3. Testa o retorno para dados nulos
    try {
        sistema.carregarDados(null);
        assert.ok(true, "carregarDados com null deve retornar sem erro.");
    } catch (e) {
        assert.ok(false, "carregarDados com null não deve causar erro.");
    }
}

QUnit.module("Sistema de Agendamento", () => {
    QUnit.test("CRUD de salas", assert => testaCRUDSala(assert));
    QUnit.test("Adicionar agendamento válido", assert => testaAdicaoAgendamentoSucesso(assert));
    QUnit.test("Verificação de conflitos e erros", assert => testaConflitoAgendamento(assert));
    QUnit.test("Carregamento de dados", assert => testaCarregarDados(assert));
});