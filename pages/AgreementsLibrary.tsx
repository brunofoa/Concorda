
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

interface AgreementTemplate {
  id: string;
  category: string;
  title: string;
  commitment: string;
  rules: string[];
  penalty: string;
  validity: string;
  color: string;
  icon: string;
}

const templates: AgreementTemplate[] = [
  {
    id: '1',
    category: 'Casais',
    title: 'Escolha do Filme de Sexta',
    commitment: 'Acordo para decidir quem escolhe o filme da noite sem brigas ou enrolação.',
    rules: ['A escolha deve durar no máximo 5 minutos', 'Proibido vetar mais de 2 opções', 'O gênero deve alternar toda semana'],
    penalty: 'Escolher o filme da próxima semana (e o outro escolhe o lanche)',
    validity: 'Indeterminado',
    color: '#FF88BB',
    icon: 'movie'
  },
  {
    id: '7',
    category: 'Casais',
    title: 'Pausa antes da treta',
    commitment: 'Quando a discussão esquentar, um dos dois pode pedir 10 minutos de pausa — e o outro precisa respeitar.',
    rules: ['Quem pedir a pausa precisa voltar em até 10 minutos pra conversar de novo', 'Durante a pausa, nada de mensagens passivo-agressivas ou portinha batida', 'Vale sair do ambiente, respirar, tomar água — mas não vale ignorar o assunto depois'],
    penalty: 'Quem furar o acordo lava a louça sozinho no dia seguinte (mesmo que não tenha sujado nada).',
    validity: 'Indeterminado',
    color: '#FF88BB',
    icon: 'timer'
  },
  {
    id: '8',
    category: 'Casais',
    title: 'Celular invisível na cama',
    commitment: 'Quando um dos dois chegar na cama, o celular fica fora do alcance da mão — literalmente.',
    rules: ['Celular vai pra criado-mudo, mesinha ou outro cômodo', 'Alarme pode ficar ligado, mas sem ficar checando notificação', 'Conversa, carinho ou até silêncio compartilhado valem mais que tela'],
    penalty: 'Quem descumprir prepara o café da manhã do outro no dia seguinte (com direito a capricho).',
    validity: 'Indeterminado',
    color: '#FF88BB',
    icon: 'bed'
  },
  {
    id: '9',
    category: 'Casais',
    title: 'Eu decido, você executa',
    commitment: 'Quando um estiver cansado demais pra decidir o que comer/fazer, o outro decide — e quem tá cansado não pode reclamar.',
    rules: ['Só vale usar esse acordo quando a pessoa realmente tiver sem energia mental', 'Quem decide leva em conta as preferências do outro (nada de sacanagem)', 'Não vale ficar dizendo "tanto faz" e depois criticar a escolha'],
    penalty: 'Quem reclamar da decisão toma banho gelado no próximo dia (ou perde o controle remoto por 24h).',
    validity: 'Indeterminado',
    color: '#FF88BB',
    icon: 'psychology'
  },
  {
    id: '10',
    category: 'Casais',
    title: 'Dia livre de cobrança',
    commitment: 'Uma vez por semana, cada um tem direito a um dia sem ser cobrado de nada doméstico — desde que avise antes.',
    rules: ['O dia precisa ser combinado com antecedência (nada de surpresa)', 'Não vale deixar a casa pegando fogo — é sobre não cobrar pequenas coisas', 'No dia seguinte, a vida volta ao normal sem drama acumulado'],
    penalty: 'Quem cobrar no dia errado faz uma massagem de 15 minutos no outro (sem reclamar).',
    validity: 'Indeterminado',
    color: '#FF88BB',
    icon: 'spa'
  },
  {
    id: '11',
    category: 'Casais',
    title: 'Saudade tem hora marcada',
    commitment: 'Se um dos dois estiver ocupado/focado em algo, o outro espera até o momento combinado pra puxar conversa ou pedir atenção.',
    rules: ['Quem tá focado avisa: "termino em X minutos" — e cumpre o prazo', 'Quem tá esperando não fica fazendo gracinha, cutucando ou suspirando alto', 'Quando o tempo acabar, atenção total — sem enrolação'],
    penalty: 'Quem furar escolhe o programa do próximo fim de semana — mas o outro tem poder de veto em uma coisa só.',
    validity: 'Indeterminado',
    color: '#FF88BB',
    icon: 'hourglass_bottom'
  },
  {
    id: '2',
    category: 'Casa',
    title: 'Pia Limpa ao Acordar',
    commitment: 'Garantir que ninguém encontre louça suja ao preparar o café da manhã.',
    rules: ['Toda louça deve ser lavada antes de dormir', 'Restos de comida devem ir pro lixo imediatamente', 'Secar é opcional, mas guardar é apreciado'],
    penalty: 'Lavar a louça de todos no próximo jantar',
    validity: '1 Mês',
    color: '#4ADE80',
    icon: 'restaurant'
  },
  {
    id: '16',
    category: 'Casa',
    title: 'Limpou, usou? Guardou.',
    commitment: 'Cada um que usar um espaço da casa deixa ele do jeito que encontrou, ou melhor.',
    rules: ['Cozinhou? Pia limpa antes de sentar pra comer', 'Usou o banheiro? Deixa apresentável (papel, descarga, pia seca)', 'Pegou algo emprestado de outro cômodo? Devolve no lugar'],
    penalty: 'Quem deixar bagunça acumulada vira o responsável pela limpeza geral do ambiente no fim de semana (sozinho, sem ajuda).',
    validity: 'Indeterminado',
    color: '#4ADE80',
    icon: 'cleaning_services'
  },
  {
    id: '17',
    category: 'Casa',
    title: 'Barulho tem horário nobre',
    commitment: 'Depois das 22h nos dias de semana (e 23h no fim de semana), o volume da casa cai pela metade.',
    rules: ['Vale pra música, TV, conversa alta, videogame e até secador de cabelo', 'Se tiver evento especial ou visita, avisa no grupo com antecedência', 'Quem acordar cedo respeita quem dorme até tarde, e vice-versa'],
    penalty: 'Quem fizer barulho fora do horário paga café da manhã (ou almoço) pra quem reclamar, sem revirar os olhos.',
    validity: 'Indeterminado',
    color: '#4ADE80',
    icon: 'volume_off'
  },
  {
    id: '18',
    category: 'Casa',
    title: 'Cada um no seu quadrado',
    commitment: 'Espaços privativos (quarto, gaveta, prateleira da geladeira) são intocáveis, a não ser que o dono autorize.',
    rules: ['Não mexe, não pega emprestado, não "só dá uma olhadinha"', 'Se precisar de algo urgente do espaço do outro, manda mensagem pedindo antes', 'Áreas comuns são de todos, mas ninguém ocupa demais (tipo deixar mochila na sala por dias)'],
    penalty: 'Quem invadir espaço alheio sem permissão faz uma tarefa doméstica extra escolhida pela pessoa invadida (lavar banheiro tá liberado).',
    validity: 'Indeterminado',
    color: '#4ADE80',
    icon: 'privacy_tip'
  },
  {
    id: '3',
    category: 'Outros',
    title: 'DJ do Carro',
    commitment: 'Regras de ouro para a trilha sonora da viagem não virar um caos.',
    rules: ['O motorista tem poder de veto absoluto', 'A playlist deve ser democrática', 'Proibido repetir a mesma música 3 vezes'],
    penalty: 'Ficar 30 minutos sem poder sugerir música',
    validity: 'Indeterminado',
    color: '#B39DDB',
    icon: 'directions_car'
  },
  {
    id: '4',
    category: 'Família',
    title: 'Cuidado com o Pet',
    commitment: 'Divisão justa das tarefas do nosso amigo de quatro patas.',
    rules: ['Passeio das 07h é do filho mais velho', 'Troca da água é diária às 12h', 'Escovação aos domingos'],
    penalty: 'Limpar as "surpresas" do quintal por 3 dias seguidos',
    validity: '3 Meses',
    color: '#FFD54F',
    icon: 'pets'
  },
  {
    id: '19',
    category: 'Família',
    title: 'Mexeu sem pedir? Devolveu pior',
    commitment: 'Ninguém pega nada do quarto ou das coisas do outro sem autorização, ponto final.',
    rules: ['Quer pegar emprestado? Pergunta antes (pessoalmente, não gritando do outro quarto)', 'Se emprestar, devolve no mesmo dia e do jeito que pegou (limpo, carregado, inteiro)', 'Emergências tipo "preciso da caneta AGORA" pedem desculpa depois e devolvem com chocolate'],
    penalty: 'Quem pegar sem permissão fica 3 dias proibido de pedir qualquer coisa emprestada do irmão(ã). Se estragar algo, reembolsa ou repõe.',
    validity: 'Indeterminado',
    color: '#FFD54F',
    icon: 'do_not_touch'
  },
  {
    id: '20',
    category: 'Família',
    title: 'Zoeira tem limite visível',
    commitment: 'Brincadeira e zoação são permitidas, até o momento em que alguém falar "parou" de verdade.',
    rules: ['Se a pessoa pediu pra parar (com palavra, gesto ou cara séria), para na hora, não "só mais uma"', 'Não vale zoar sobre inseguranças, medos ou assuntos que o outro já disse que incomodam', 'Se passou do ponto, pede desculpas sem ficar de mimimi tipo "você é sensível demais"'],
    penalty: 'Quem continuar depois do "parou" perde o direito de fazer piada com o irmão(ã) por 2 dias inteiros (e aguenta calado se levarem troco).',
    validity: 'Indeterminado',
    color: '#FFD54F',
    icon: 'back_hand'
  },
  {
    id: '21',
    category: 'Família',
    title: 'Se eu for aí e achar, você já sabe',
    commitment: 'Antes de gritar "não achei!", a pessoa procura de verdade por pelo menos 3 minutos, mexendo nas coisas, abrindo gavetas, olhando além do nariz.',
    rules: ['Procurou em 3 lugares diferentes? Pode pedir ajuda (sem drama)', 'Mãe só vai ajudar se a pessoa realmente tiver procurado, nada de ficar parado esperando ser servido', 'Se a mãe achar em menos de 10 segundos no lugar óbvio, o acordo foi quebrado'],
    penalty: 'Quem gritar "não tem!" sem procurar direito organiza a gaveta/armário onde a coisa estava (e ainda ouve um "eu não falei?" de brinde).',
    validity: 'Indeterminado',
    color: '#FFD54F',
    icon: 'search'
  },
  {
    id: '22',
    category: 'Família',
    title: 'Sandália voadora aposentada',
    commitment: 'Chinelo, sandália e qualquer calçado ficam nos pés da mãe, nada de virar projétil em momento de estresse.',
    rules: ['Quando a mãe estiver irritada, pode contar até 10, sair do ambiente ou falar em voz alta (mas sem atirar nada)', 'Filho(a) não provoca nos momentos de tensão com piadinha ou birra calculada', 'Se rolar vontade de arremesso, vale almofada, mais leve, menos trauma'],
    penalty: 'Mãe que jogar chinelo paga sorvete. Filho(a) que provocar até a mãe perder a paciência lava o banheiro (e reflete sobre suas escolhas).',
    validity: 'Indeterminado',
    color: '#FFD54F',
    icon: 'front_hand'
  },
  {
    id: '23',
    category: 'Família',
    title: 'Você não é todo mundo',
    commitment: 'Argumento do tipo "mas todo mundo vai!" ou "todo mundo tem!" não cola mais, é preciso explicar por que de verdade.',
    rules: ['Filho(a) apresenta motivos reais: "quero ir porque é importante pra mim por X razão"', 'Mãe ouve os argumentos antes de decidir (sem já chegar negando)', 'Se a resposta for "não", vem acompanhada de explicação honesta, não só "porque eu disse"'],
    penalty: 'Quem usar "todo mundo" como argumento perde automaticamente o pedido daquela vez. Mãe que responder só com "porque não" tem que explicar direito depois (ou reconsidera).',
    validity: 'Indeterminado',
    color: '#FFD54F',
    icon: 'fingerprint'
  },
  {
    id: '5',
    category: 'Amigos',
    title: 'Rolezinho Planejado',
    commitment: 'Evitar o "vamos ver" e garantir que os encontros aconteçam.',
    rules: ['Confirmar presença até 48h antes', 'Proibido desmarcar por preguiça de última hora', 'Foco total no papo (celular na bolsa)'],
    penalty: 'Pagar a primeira rodada de drinks/sucos no próximo encontro',
    validity: '1 Ano',
    color: '#4FC3F7',
    icon: 'celebration'
  },
  {
    id: '12',
    category: 'Amigos',
    title: 'Não Vou, Mas Aviso',
    commitment: 'Se não der pra ir no rolê, avisa com honestidade, nada de sumir ou inventar desculpa furada.',
    rules: ['Pode falar "tô sem grana", "tô cansado" ou "não tô afim mesmo", sem drama', 'Quem cancela avisa com pelo menos 2h de antecedência (exceto emergência real)', 'Quem recebe o "não" aceita de boa, sem fazer textão guilhotinando'],
    penalty: 'Quem der ghosting paga a próxima rodada de lanche/bebida do grupo (ou manda um pix simbólico de R$10).',
    validity: 'Indeterminado',
    color: '#4FC3F7',
    icon: 'event_busy'
  },
  {
    id: '13',
    category: 'Amigos',
    title: 'Desabafo tem prazo de validade',
    commitment: 'Quando um amigo pedir pra desabafar, o outro escuta de verdade, mas combinam um tempo limite antes de começar.',
    rules: ['Quem vai desabafar pergunta: "tem uns 15 minutos pra mim?" (e respeita o tempo)', 'Quem escuta não fica mexendo no celular nem cortando o assunto', 'Se precisar de mais tempo depois, marca outro momento, sem forçar'],
    penalty: 'Quem ultrapassar o tempo sem avisar leva bolo/salgadinho no próximo encontro (ou paga o Uber do amigo)',
    validity: 'Indeterminado',
    color: '#4FC3F7',
    icon: 'hourglass_top'
  },
  {
    id: '14',
    category: 'Amigos',
    title: 'Racha justo, choro zero',
    commitment: 'Quando rolar gasto em grupo, todo mundo racha ou combina antes quem paga o quê. sem mimimi depois.',
    rules: ['Se alguém tá sem condições, avisa antes, não na hora de pagar', 'Quem consome mais (ou pede coisa cara) assume a diferença sem peso na consciência alheia', 'Aplicativo de racha é amigo: divide certinho e acabou'],
    penalty: 'Quem reclamar da conta depois de ter topado paga sozinho a próxima saída em grupo (ou fica de fora da seguinte).',
    validity: 'Indeterminado',
    color: '#4FC3F7',
    icon: 'receipt_long'
  },
  {
    id: '15',
    category: 'Amigos',
    title: 'Fofoca tem filtro',
    commitment: 'O que um amigo conta em confiança não sai da conversa, nem "sem querer", nem "só pra um".',
    rules: ['Se tiver dúvida se pode compartilhar, pergunta antes: "posso contar pra fulano?"', 'Fofoca de terceiros pode rolar, mas nada que envolva segredo pessoal de quem confiou', 'Se vazar, assume na lata e pede desculpas, sem invenção'],
    penalty: 'Quem espalhar segredo perde o direito de receber confidências por 1 mês (e ainda leva um esporro merecido).',
    validity: 'Indeterminado',
    color: '#4FC3F7',
    icon: 'lock'
  },
  {
    id: '6',
    category: 'Financeiro',
    title: 'Fundo da Cerveja/Lazer',
    commitment: 'Caixinha comum para gastos com diversão do grupo.',
    rules: ['Depósito de R$ 50 todo dia 05', 'Uso apenas para atividades em grupo', 'Transparência total nos gastos'],
    penalty: 'Pagar R$ 10 de multa para o fundo',
    validity: 'Indeterminado',
    color: '#E2E8F0',
    icon: 'savings'
  }
];

const categories = ['Todos', 'Casais', 'Amigos', 'Casa', 'Financeiro', 'Família', 'Outros'];

const AgreementsLibrary: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedTemplate, setSelectedTemplate] = useState<AgreementTemplate | null>(null);

  const filteredTemplates = activeCategory === 'Todos'
    ? templates
    : templates.filter(t => t.category === activeCategory);

  const handleUseTemplate = (template: AgreementTemplate) => {
    navigate('/new', { state: { template } });
  };

  return (
    <Layout title="Biblioteca">
      <div className="px-6 pb-24">
        <header className="py-6">
          <h2 className="text-3xl font-black tracking-tighter leading-none mb-2">Modelos Prontos</h2>
          <p className="text-slate-500 font-medium text-sm">Escolha um ponto de partida e ajuste como quiser.</p>
        </header>

        {/* Categorias */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6 -mx-2 px-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-5 py-2 rounded-full border-2 border-black font-black text-[10px] uppercase tracking-widest transition-all ${activeCategory === cat
                ? 'bg-black text-white neo-shadow !shadow-[3px_3px_0px_0px_rgba(74,222,128,1)]'
                : 'bg-white text-black hover:bg-slate-50'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Galeria */}
        <div className="grid grid-cols-1 gap-6">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className="bg-white dark:bg-zinc-900 border-3 border-black rounded-[2.5rem] p-6 neo-shadow flex flex-col group transition-all hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className="w-12 h-12 rounded-2xl border-2 border-black flex items-center justify-center neo-shadow !shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  style={{ backgroundColor: template.color }}
                >
                  <span className="material-icons-outlined text-black">{template.icon}</span>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest border-2 border-black px-3 py-1 rounded-full">
                  {template.category}
                </span>
              </div>

              <h3 className="text-2xl font-black mb-2 leading-tight">{template.title}</h3>
              <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium mb-6 line-clamp-2">
                {template.commitment}
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2">
                  <span className="material-icons-outlined text-sm text-primary">check_circle</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-black dark:text-white">
                    {template.rules.length} Regras Sugeridas
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-icons-outlined text-sm text-accent-pink">gavel</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-black dark:text-white">
                    Multa: {template.penalty.length > 25 ? template.penalty.substring(0, 25) + '...' : template.penalty}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedTemplate(template)}
                className="w-full py-4 rounded-full border-2 border-black font-black text-xs uppercase tracking-widest transition-all bg-white hover:bg-slate-50 neo-shadow !shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Ver Modelo
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedTemplate(null)}>
          <div
            className="bg-white dark:bg-zinc-900 w-full max-w-md max-h-[85vh] overflow-y-auto rounded-[2.5rem] border-3 border-black p-6 neo-shadow relative animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div
                className="w-14 h-14 rounded-2xl border-2 border-black flex items-center justify-center neo-shadow !shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: selectedTemplate.color }}
              >
                <span className="material-icons-outlined text-black text-2xl">{selectedTemplate.icon}</span>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <span className="material-icons-outlined">close</span>
              </button>
            </div>

            {/* Content */}
            <span className="text-[9px] font-black uppercase tracking-widest border-2 border-black px-3 py-1 rounded-full mb-4 inline-block">
              {selectedTemplate.category}
            </span>

            <h3 className="text-3xl font-black mb-4 leading-tight">{selectedTemplate.title}</h3>

            <div className="bg-slate-50 dark:bg-zinc-800 rounded-2xl p-4 mb-6 border-l-4 border-black">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                "{selectedTemplate.commitment}"
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <h4 className="flex items-center gap-2 font-black text-sm uppercase mb-3">
                  <span className="material-icons-outlined text-primary">list_alt</span>
                  Regras Sugeridas
                </h4>
                <ul className="space-y-2">
                  {selectedTemplate.rules.map((rule, idx) => (
                    <li key={idx} className="flex gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                      <span className="font-bold text-black dark:text-white">{idx + 1}.</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="flex items-center gap-2 font-black text-sm uppercase mb-3">
                  <span className="material-icons-outlined text-accent-pink">gavel</span>
                  A Multa
                </h4>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-900">
                  {selectedTemplate.penalty}
                </p>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={() => handleUseTemplate(selectedTemplate)}
              className="w-full py-4 rounded-full border-2 border-black font-black text-sm uppercase tracking-widest transition-all bg-primary hover:bg-emerald-400 active:scale-95 neo-shadow !shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
            >
              <span>Usar este modelo</span>
              <span className="material-icons-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AgreementsLibrary;
