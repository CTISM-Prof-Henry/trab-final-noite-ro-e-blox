// agendamento-definitions.js - VERSÃO ATUALIZADA

// A classe Sala agora terá mais detalhes, conforme seu design
export class Sala {
    constructor(id_sala, nome, tipo, capacidade) {
        this.id_sala = id_sala;
        this.nome = nome;
        this.tipo = tipo; // "Laboratório", "Sala de Aula", etc.
        this.capacidade = capacidade;
    }
}

// As classes Responsavel e Agendamento continuam iguais...
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
        this.data_inicio = data_inicio;
        this.data_fim = data_fim;
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

    // MÉTODO ATUALIZADO para aceitar mais detalhes
    adicionarSala(nome, tipo, capacidade) {
        if (!nome || !tipo || !capacidade) {
            throw new Error("Nome, tipo e capacidade são obrigatórios.");
        }
        this.ultimo_id_sala++;
        const novaSala = new Sala(this.ultimo_id_sala, nome, tipo, capacidade);
        this.salas.push(novaSala);
        this.salvarNoLocalStorage(); // Salva os dados após adicionar!
        return novaSala;
    }

    adicionarAgendamento(id_sala, nome_responsavel, data_inicio, data_fim, hora_inicio, hora_fim, dia_semana) {
        // Validação básica de campos
        if (!id_sala || !nome_responsavel || !data_inicio || !data_fim || !hora_inicio || !hora_fim) {
            throw new Error('Por favor, preencha todos os campos obrigatórios!');
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

                if (!sobreposicaoDeHorario) {
                    continue; // Se não há conflito de horário, pode pular para o próximo agendamento
                }

                // 3. Verifica se os PERÍODOS (datas) se sobrepõem
                // Precisamos garantir que as datas sejam tratadas sem a parte do horário para evitar bugs
                const inicioNovoSemHora = new Date(data_inicio.getFullYear(), data_inicio.getMonth(), data_inicio.getDate());
                const fimNovoSemHora = new Date(data_fim.getFullYear(), data_fim.getMonth(), data_fim.getDate());
                const inicioExistenteSemHora = new Date(agendamentoExistente.data_inicio.getFullYear(), agendamentoExistente.data_inicio.getMonth(), agendamentoExistente.data_inicio.getDate());
                const fimExistenteSemHora = new Date(agendamentoExistente.data_fim.getFullYear(), agendamentoExistente.data_fim.getMonth(), agendamentoExistente.data_fim.getDate());

                const sobreposicaoDeData = inicioNovoSemHora <= fimExistenteSemHora && fimNovoSemHora >= inicioExistenteSemHora;

                if (!sobreposicaoDeData) {
                    continue; // Se não há conflito de datas, pode pular
                }

                // 4. Se chegou até aqui, os horários e as datas se cruzam.
                //    Agora, a verificação final: os DIAS DA SEMANA conflitam?
                const novoEhTodosOsDias = (dia_semana === -1);
                const existenteEhTodosOsDias = (agendamentoExistente.dia_semana === -1);
                const mesmoDiaDaSemana = (dia_semana === agendamentoExistente.dia_semana);

                if (novoEhTodosOsDias || existenteEhTodosOsDias || mesmoDiaDaSemana) {
                    // Se o novo é para todos os dias, OU o existente é para todos os dias,
                    // OU ambos são para o mesmo dia específico (ex: duas terças-feiras),
                    // ENTÃO HÁ CONFLITO!
                    throw new Error('Esta sala já está reservada em um período, horário e dia da semana conflitante!');
                }
            }
        }

        // Se passou por todas as verificações, pode adicionar
        this.ultimo_id_agendamento++;
        const novoAgendamento = new Agendamento(
            this.ultimo_id_agendamento,
            id_sala,
            nome_responsavel,
            data_inicio,
            data_fim,
            hora_inicio,
            hora_fim,
            dia_semana // <- Passando o novo dado
        );

        this.agendamentos.push(novoAgendamento);
        this.salvarNoLocalStorage(); // Não esquecer de salvar!
        return novoAgendamento;
    }

    getSala(id_sala) { /* ...código igual ao anterior... */ }

    // ===== NOVOS MÉTODOS PARA PERSISTÊNCIA =====

    salvarNoLocalStorage() {
        // Converte todo o objeto 'SistemaAgendamento' para uma string JSON e salva
        localStorage.setItem('sistemaAgendamento', JSON.stringify(this));
    }

    carregarDoLocalStorage() {
        const dados = localStorage.getItem('sistemaAgendamento');
        if (dados) {
            const sistemaSalvo = JSON.parse(dados);
            // Copia os dados salvos para o objeto atual
            this.salas = sistemaSalvo.salas;
            this.agendamentos = sistemaSalvo.agendamentos;
            this.responsaveis = sistemaSalvo.responsaveis;
            this.ultimo_id_sala = sistemaSalvo.ultimo_id_sala;
            this.ultimo_id_agendamento = sistemaSalvo.ultimo_id_agendamento;
            this.ultimo_id_responsavel = sistemaSalvo.ultimo_id_responsavel;
        }
    }
}