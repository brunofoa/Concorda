
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
                onClick={() => handleUseTemplate(template)}
                className="w-full py-4 rounded-full border-2 border-black font-black text-xs uppercase tracking-widest transition-all bg-primary hover:bg-emerald-400 active:scale-95 neo-shadow !shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                USAR ESTE MODELO
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AgreementsLibrary;
