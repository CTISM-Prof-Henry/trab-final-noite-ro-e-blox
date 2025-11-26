export class Sala {
    constructor(id_sala, nome, tipo, capacidade) {
        this.id_sala = id_sala;
        this.nome = nome;
        this.tipo = tipo;
        this.capacidade = capacidade;
    }
}

export class Responsavel {
    constructor(id_responsavel, nome) {
        this.id_responsavel = id_responsavel;
        this.nome = nome;
    }
}

export class Agendamento {
    constructor(id_agendamento, id_sala, nome_responsavel, data_inicio, data_fim, hora_inicio, hora_fim, dia_semana) {
        this.id_agendamento = id_agendamento;
        this.id_sala = id_sala;
        this.nome_responsavel = nome_responsavel;
        this.data_inicio = new Date(data_inicio);
        this.data_fim = new Date(data_fim);
        this.hora_inicio = hora_inicio;
        this.hora_fim = hora_fim;
        this.dia_semana = dia_semana;
    }
}

export class SistemaAgendamento {
    constructor() {
        this.salas = [];
        this.agendamentos = [];
        this.responsaveis = [];

        this.ultimo_id_sala = 0;
        this.ultimo_id_agendamento = 0;
        this.ultimo_id_responsavel = 0;
    }

    adicionarSala(nome, tipo, capacidade) {
        if (!nome || !tipo || !capacidade) {
            throw new Error("Todos os campos são obrigatórios.");
        }
        this.ultimo_id_sala++;
        const novaSala = new Sala(this.ultimo_id_sala, nome, tipo, capacidade);
        this.salas.push(novaSala);
        return novaSala;
    }

    adicionarAgendamento(id_sala, nome_responsavel, data_inicio, data_fim, hora_inicio, hora_fim, dia_semana) {
        // Validação básica de campos
        if (!id_sala || !nome_responsavel || !data_inicio || !data_fim || !hora_inicio || !hora_fim) {
            throw new Error('Por favor, preencha todos os campos obrigatórios.');
        }

        const inicioAgendamento = parseInt(hora_inicio.replace(':', ''));
        const fimAgendamento = parseInt(hora_fim.replace(':', ''));

        // Verifica se já não existe um agendamento conflitante
        for (const agendamentoExistente of this.agendamentos) {
            // 1. Verifica se é a mesma sala
            if (agendamentoExistente.id_sala === id_sala) {

                // 2. Verifica se os HORÁRIOS se sobrepõem
                const inicioExistente = parseInt(agendamentoExistente.hora_inicio.replace(':', ''));
                const fimExistente = parseInt(agendamentoExistente.hora_fim.replace(':', ''));
                const sobreposicaoDeHorario = inicioAgendamento < fimExistente && fimAgendamento > inicioExistente;

                if (!sobreposicaoDeHorario) continue;

                // 3. Verifica se os PERÍODOS (datas) se sobrepõem
                const inicioNovoSemHora = new Date(data_inicio.getFullYear(), data_inicio.getMonth(), data_inicio.getDate());
                const fimNovoSemHora = new Date(data_fim.getFullYear(), data_fim.getMonth(), data_fim.getDate());
                const inicioExistenteSemHora = new Date(agendamentoExistente.data_inicio.getFullYear(), agendamentoExistente.data_inicio.getMonth(), agendamentoExistente.data_inicio.getDate());
                const fimExistenteSemHora = new Date(agendamentoExistente.data_fim.getFullYear(), agendamentoExistente.data_fim.getMonth(), agendamentoExistente.data_fim.getDate());

                const sobreposicaoDeData = inicioNovoSemHora <= fimExistenteSemHora && fimNovoSemHora >= inicioExistenteSemHora;

                if (!sobreposicaoDeData) continue;

                // 4. Verificação final: os dias da semana conflitam?
                const novoEhTodosOsDias = (dia_semana === -1);
                const existenteEhTodosOsDias = (agendamentoExistente.dia_semana === -1);
                const mesmoDiaDaSemana = (dia_semana === agendamentoExistente.dia_semana);

                if (novoEhTodosOsDias || existenteEhTodosOsDias || mesmoDiaDaSemana) {
                    throw new Error('Esta sala já está reservada em um período, horário e dia da semana conflitante!');
                }
            }
        }

        this.ultimo_id_agendamento++;
        const novoAgendamento = new Agendamento(
            this.ultimo_id_agendamento, id_sala, nome_responsavel,
            data_inicio, data_fim, hora_inicio, hora_fim, dia_semana
        );

        this.agendamentos.push(novoAgendamento);
        return novoAgendamento;
    }

    getSala(id_sala) {
        const sala = this.salas.find(s => s.id_sala === id_sala);
        if (!sala) throw new Error('Sala não encontrada.');
        return sala;
    }

    carregarDados(dadosObjeto) {
        if (!dadosObjeto) return;

        this.salas = dadosObjeto.salas;

        // Reconstrói agendamentos para garantir que as datas sejam objetos Date
        this.agendamentos = dadosObjeto.agendamentos.map(ag => new Agendamento(
            ag.id_agendamento, ag.id_sala, ag.nome_responsavel,
            ag.data_inicio, ag.data_fim, ag.hora_inicio, ag.hora_fim, ag.dia_semana
        ));

        this.responsaveis = dadosObjeto.responsaveis || [];
        this.ultimo_id_sala = dadosObjeto.ultimo_id_sala;
        this.ultimo_id_agendamento = dadosObjeto.ultimo_id_agendamento;
        this.ultimo_id_responsavel = dadosObjeto.ultimo_id_responsavel;
    }
}
