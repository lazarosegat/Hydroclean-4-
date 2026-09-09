/* ============================================================================
   HydroClean — CONFIGURAÇÃO CENTRAL
   ----------------------------------------------------------------------------
   Este é o ÚNICO arquivo que você precisa editar para atualizar contatos,
   parâmetros do simulador e resultados experimentais.
   Todos os valores marcados com "PLACEHOLDER" devem ser substituídos pelos
   dados reais do projeto quando estiverem disponíveis.
   ========================================================================== */

window.HYDROCLEAN_CONFIG = {

  /* --------------------------------------------------------------------------
     1) CONTATOS  —  troque pelos dados reais aqui
     -------------------------------------------------------------------------- */
  contato: {
    // Número no formato internacional, SOMENTE dígitos: DDI + DDD + número
    // Ex.: 5551999999999  (55 = Brasil, 51 = DDD, restante = número)
    whatsapp: "5500000000000",                 // PLACEHOLDER
    // Mensagem que já aparece escrita ao abrir o WhatsApp
    whatsappMensagem: "Olá! Vim pelo site do HydroClean e gostaria de saber mais sobre o projeto.",

    // Usuário do Instagram SEM o @
    instagram: "hydroclean",                    // PLACEHOLDER

    // E-mail de contato do projeto
    email: "contato@hydroclean.eco",            // PLACEHOLDER

    // Telefone para ligação, SOMENTE dígitos com DDI + DDD
    telefone: "5500000000000",                  // PLACEHOLDER

    // Texto exibido do telefone (formatação livre, só visual)
    telefoneLabel: "(00) 00000-0000"            // PLACEHOLDER
  },

  /* --------------------------------------------------------------------------
     2) FORMULÁRIO DE CONTATO
     Define para onde a mensagem do formulário é enviada.
       "whatsapp" -> abre o WhatsApp com a mensagem montada (recomendado, sem backend)
       "email"    -> abre o app de e-mail (mailto) com a mensagem
     -------------------------------------------------------------------------- */
  formulario: {
    destino: "whatsapp"   // "whatsapp" ou "email"
  },

  /* --------------------------------------------------------------------------
     3) SIMULADOR  —  cálculo DINÂMICO
     Ajuste os números conforme os dados reais forem definidos pelo projeto.
     -------------------------------------------------------------------------- */
  simulador: {
    // Consumo estimado de água por pessoa, por dia (litros).
    // Valor de referência configurável — ajuste conforme o projeto definir.
    litrosPorPessoaDia: 50,

    // Multiplicador de demanda conforme o tipo de uso.
    // (uso não-residencial costuma ter demanda diferente por pessoa)
    fatorUso: {
      residencial: 1.0,
      rural:       1.3,
      escola:      0.6,
      empresa:     1.1,
      emergencia:  0.8
    },

    // Margem de segurança aplicada sobre a demanda para dimensionar o sistema.
    margemSeguranca: 1.15,

    // A prioridade escolhida altera a capacidade recomendada:
    //  - economia   -> dimensiona mais justo (capacidade menor, menor custo)
    //  - equilibrio  -> dimensionamento padrão
    //  - capacidade -> folga maior (capacidade sobressalente)
    fatorPrioridade: {
      economia:   0.9,
      equilibrio: 1.0,
      capacidade: 1.2
    },

    // Faixa de pessoas do controle deslizante
    minPessoas: 1,
    maxPessoas: 120,

    // Catálogo de modelos. "capacidade" em litros/dia é usada no cálculo.
    // As faixas de preço são estimativas de demonstração (configuráveis).
    // "tags" indica os usos para os quais o modelo é preferencial.
    modelos: [
      { id:"home",   nome:"HydroClean Home",   capacidade:200,  paineis:"1 painel",        preco:"R$ 2.500 a R$ 4.000",   tags:["residencial"], desc:"Modelo compacto, pensado para famílias pequenas com foco em economia no uso residencial." },
      { id:"plus",   nome:"HydroClean Plus",   capacidade:500,  paineis:"2 painéis",       preco:"R$ 5.500 a R$ 8.500",   tags:["residencial","empresa"], desc:"Equilíbrio entre capacidade e custo, indicado para famílias maiores ou pequenos grupos." },
      { id:"rescue", nome:"HydroClean Rescue", capacidade:600,  paineis:"2 painéis",       preco:"R$ 9.000 a R$ 14.000",  tags:["emergencia"], desc:"Versão portátil, proposta para situações emergenciais, com montagem rápida e transporte facilitado." },
      { id:"edu",    nome:"HydroClean Edu",    capacidade:800,  paineis:"2 painéis",       preco:"R$ 8.000 a R$ 12.000",  tags:["escola"], desc:"Voltado ao uso escolar, com foco pedagógico e capacidade média para o dia a dia." },
      { id:"field",  nome:"HydroClean Field",  capacidade:1500, paineis:"3 painéis",       preco:"R$ 12.000 a R$ 18.000", tags:["rural"], desc:"Robusto para propriedades rurais, priorizando durabilidade e autonomia solar." },
      { id:"pro",    nome:"HydroClean Pro",    capacidade:3000, paineis:"4 ou mais painéis", preco:"R$ 22.000 a R$ 35.000", tags:["empresa","comunidade"], desc:"Alta capacidade, proposto para comunidades ou empresas com maior demanda de água tratada." }
    ]
  },

  /* --------------------------------------------------------------------------
     4) RESULTADOS EXPERIMENTAIS
     ATENÇÃO: não invente dados. Enquanto os valores reais não existirem,
     deixe "valor" como null — o site mostrará automaticamente "Aguardando dados".
     Assim que o projeto medir, basta preencher "valor", "antes" e "depois".
     -------------------------------------------------------------------------- */
  resultados: {
    // Texto de contexto exibido na seção
    observacao: "Os valores abaixo serão preenchidos com os dados reais obtidos nos testes do protótipo. Campos vazios indicam medições ainda não registradas.",
    parametros: [
      { chave:"turbidez",  nome:"Turbidez",           unidade:"NTU",   antes:null, depois:null, melhor:"menor" },
      { chave:"ph",        nome:"pH",                 unidade:"",      antes:null, depois:null, melhor:"neutro" },
      { chave:"temp",      nome:"Temperatura",        unidade:"°C",    antes:null, depois:null, melhor:"neutro" },
      { chave:"od",        nome:"Oxigênio dissolvido", unidade:"mg/L", antes:null, depois:null, melhor:"maior" },
      { chave:"odor",      nome:"Odor",               unidade:"",      antes:null, depois:null, melhor:"menor" },
      { chave:"aparencia", nome:"Aparência",          unidade:"",      antes:null, depois:null, melhor:"neutro" }
    ]
  }
};
