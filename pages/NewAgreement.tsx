
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { getRuleSuggestions, getPenaltySuggestions, generateAgreementTitle } from '../services/openaiService';
import { AgreementTone, AgreementCategory } from '../types';

type SuggestionType = 'rules' | 'penalties' | null;

const NewAgreement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // States para o formulário
  const [tone, setTone] = useState<AgreementTone>('Divertido');
  const [category, setCategory] = useState<AgreementCategory>('Casais');
  const [participants, setParticipants] = useState(['', '']);
  const [commitment, setCommitment] = useState('');
  const [rules, setRules] = useState<string[]>([]);
  const [currentRule, setCurrentRule] = useState('');
  const [penalty, setPenalty] = useState('');
  const [validity, setValidity] = useState('Indeterminado');

  // Preencher se vier da biblioteca
  useEffect(() => {
    if (location.state && location.state.template) {
      const { template } = location.state;
      setCommitment(template.commitment);
      setRules(template.rules);
      setPenalty(template.penalty);
      setValidity(template.validity);
    }
  }, [location]);

  // States para o Modal de IA
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalType, setModalType] = useState<SuggestionType>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const handleAddParticipant = () => setParticipants([...participants, '']);

  const openSuggestionModal = async (type: 'rules' | 'penalties') => {
    if (!commitment) {
      alert("Por favor, descreva o compromisso antes de pedir sugestões!");
      return;
    }
    setModalType(type);
    setIsModalOpen(true);
    setModalLoading(true);
    setAiSuggestions([]);

    try {
      const suggs = type === 'rules'
        ? await getRuleSuggestions(commitment, tone, category)
        : await getPenaltySuggestions(commitment, tone, category);
      setAiSuggestions(suggs);
    } catch (error) {
      console.error(error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleSelectSuggestion = (text: string) => {
    if (modalType === 'rules') {
      setRules([...rules, text]);
    } else {
      setPenalty(text);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setAiSuggestions([]);
  };

  const handleAddRule = (text: string) => {
    if (!text.trim()) return;
    setRules([...rules, text]);
    setCurrentRule('');
  };

  const [loading, setLoading] = useState(false);

  // ... (previous code)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit called");
    if (!user) {
      console.error("No user found in handleSubmit");
      return;
    }

    setLoading(true);

    try {
      console.log("Creating agreement for user:", user.id);
      // 1. Generate Title (AI)
      const generatedTitle = await generateAgreementTitle(commitment, tone, category);

      // 2. Insert Agreement
      const { data: agreementData, error: agreementError } = await supabase
        .from('agreements')
        .insert({
          created_by: user.id,
          description: commitment,
          tone: tone,
          category: category,
          validity: validity,
          penalty: penalty,
          title: generatedTitle,
          status: 'waiting_signatures'
        })
        .select()
        .single();

      if (agreementError) {
        console.error("Error inserting agreement:", agreementError);
        throw agreementError;
      }

      console.log("Agreement created:", agreementData);

      const agreementId = agreementData.id;

      // 2. Insert Participants
      const validParticipants = participants.filter((p) => p.trim() !== '');
      if (validParticipants.length > 0) {
        console.log("Inserting participants:", validParticipants);
        const participantsToInsert = validParticipants.map((name) => ({
          agreement_id: agreementId,
          name: name,
          color: '#' + Math.floor(Math.random() * 16777215).toString(16), // Random color
        }));

        const { error: participantsError } = await supabase
          .from('agreement_participants')
          .insert(participantsToInsert);

        if (participantsError) {
          console.error("Error inserting participants:", participantsError);
          throw participantsError;
        }
      }

      // 3. Insert Rules
      if (rules.length > 0) {
        console.log("Inserting rules:", rules);
        const rulesToInsert = rules.map((text) => ({
          agreement_id: agreementId,
          text: text,
        }));

        const { error: rulesError } = await supabase
          .from('agreement_rules')
          .insert(rulesToInsert);

        if (rulesError) {
          console.error("Error inserting rules:", rulesError);
          throw rulesError;
        }
      }

      // 4. Redirect
      console.log("Redirecting to:", `/details/${agreementId}`);
      navigate(`/details/${agreementId}`);
    } catch (error) {
      console.error('Error creating agreement:', error);
      alert(`Erro ao criar acordo: ${(error as any).message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Novo Acordo">
      <div className="px-6 pb-40 space-y-8">
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Crie um acordo justo e divertido.
        </p>

        {/* Seleção de Categoria */}
        <div className="bg-white dark:bg-zinc-900 border-3 border-black rounded-[32px] p-6 neo-shadow">
          <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4">Escolha a Categoria</h3>
          <div className="flex flex-wrap gap-2">
            {(['Casais', 'Amigos', 'Casa', 'Financeiro', 'Família', 'Outros'] as AgreementCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-2 px-4 rounded-full border-2 border-black font-black text-[10px] uppercase tracking-wider transition-all ${category === cat ? 'bg-accent-pink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-transparent'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Seleção de Tom */}
        <div className="bg-white dark:bg-zinc-900 border-3 border-black rounded-[32px] p-6 neo-shadow">
          <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4">Escolha o Tom do Acordo</h3>
          <div className="flex gap-2">
            {(['Divertido', 'Ácido', 'Neutro'] as AgreementTone[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={`flex-1 py-2 rounded-full border-2 border-black font-black text-[10px] uppercase tracking-wider transition-all ${tone === t ? 'bg-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-transparent'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Cláusula 01 - Participantes */}
          <div className="bg-white dark:bg-zinc-900 border-3 border-black rounded-[40px] p-6 neo-shadow relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Cláusula 01</span>
              <span className="material-icons-outlined text-slate-300 text-xl">group</span>
            </div>
            <h3 className="font-display font-black text-2xl mb-6 text-black dark:text-white">Dos Participantes</h3>

            <div className="space-y-4">
              {participants.map((p, idx) => (
                <div key={idx} className="relative group">
                  <input
                    className="w-full bg-slate-50 dark:bg-zinc-800 border-2 border-black rounded-full py-4 px-6 focus:ring-0 font-black text-sm placeholder:text-gray-300"
                    placeholder={`NOME DO PARTICIPANTE ${idx + 1}`}
                    value={p}
                    onChange={(e) => {
                      const newParts = [...participants];
                      newParts[idx] = e.target.value;
                      setParticipants(newParts);
                    }}
                    required
                  />
                  {participants.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setParticipants(participants.filter((_, i) => i !== idx))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                    >
                      <span className="material-icons-outlined text-sm">close</span>
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddParticipant}
                className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <span className="material-icons-outlined text-xl font-bold">add</span>
                <span className="font-black text-xs uppercase">Adicionar Participante</span>
              </button>
            </div>
          </div>

          {/* Cláusula 02 - Compromisso */}
          <div className="bg-white dark:bg-zinc-900 border-3 border-black rounded-[40px] p-6 neo-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Cláusula 02</span>
              <span className="material-icons-outlined text-slate-300 text-xl">edit_note</span>
            </div>
            <h3 className="font-display font-black text-2xl mb-4 text-black dark:text-white">Do Compromisso</h3>
            <textarea
              className="w-full bg-slate-50 dark:bg-zinc-800 border-2 border-black rounded-[32px] p-6 focus:ring-0 font-bold text-sm min-h-[140px]"
              placeholder="Descreva o que está sendo combinado aqui..."
              value={commitment}
              onChange={(e) => setCommitment(e.target.value)}
              required
            />
          </div>

          {/* Cláusula 03 - Regras */}
          <div className="bg-white dark:bg-zinc-900 border-3 border-black rounded-[40px] p-6 neo-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Cláusula 03</span>
              <span className="material-icons-outlined text-slate-300 text-xl">rule</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-black text-2xl text-black dark:text-white">Das Regras</h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Opcional</span>
            </div>

            <div className="space-y-4">
              {rules.map((rule, i) => (
                <div key={i} className="p-4 bg-primary/10 border-2 border-black rounded-2xl text-xs font-black flex justify-between items-center">
                  <span>{rule}</span>
                  <button type="button" onClick={() => setRules(rules.filter((_, idx) => idx !== i))}>
                    <span className="material-icons-outlined text-sm">close</span>
                  </button>
                </div>
              ))}

              <div className="relative group">
                <input
                  className="w-full bg-slate-50 dark:bg-zinc-800 border-2 border-black rounded-full py-4 px-6 focus:ring-0 font-bold text-sm placeholder:text-gray-300"
                  placeholder="DIGITE UMA REGRA..."
                  value={currentRule}
                  onChange={(e) => setCurrentRule(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRule(currentRule))}
                />
              </div>

              <button
                type="button"
                onClick={() => handleAddRule(currentRule)}
                className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <span className="material-icons-outlined text-xl font-bold">add</span>
                <span className="font-black text-xs uppercase">Adicionar Nova Regra</span>
              </button>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => openSuggestionModal('rules')}
                  className="flex items-center gap-2 py-2 px-4 rounded-full border-2 border-black bg-white dark:bg-zinc-800 hover:bg-slate-50 transition-all active:scale-95"
                >
                  <span className="material-icons-outlined text-sm">auto_awesome</span>
                  <span className="text-[10px] font-black uppercase tracking-wider">Sugestões da IA</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cláusula 04 - Multa */}
          <div className="bg-white dark:bg-zinc-900 border-3 border-black rounded-[40px] p-6 neo-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Cláusula 04</span>
              <span className="material-symbols-rounded text-slate-300 text-xl">sentiment_very_dissatisfied</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-black text-2xl text-black dark:text-white">Da Multa</h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Opcional</span>
            </div>

            <div className="space-y-4">
              <input
                className="w-full bg-slate-50 dark:bg-zinc-800 border-2 border-black rounded-full py-4 px-6 focus:ring-0 font-bold text-sm"
                placeholder="Ex: Pagar uma pizza gigante"
                value={penalty}
                onChange={(e) => setPenalty(e.target.value)}
              />

              <button
                type="button"
                onClick={() => openSuggestionModal('penalties')}
                className="flex items-center gap-2 py-2 px-4 rounded-full border-2 border-black bg-white dark:bg-zinc-800 hover:bg-slate-50 transition-all active:scale-95"
              >
                <span className="material-icons-outlined text-sm">auto_awesome</span>
                <span className="text-[10px] font-black uppercase tracking-wider">Ideias de Multas</span>
              </button>
            </div>
          </div>

          {/* Cláusula 05 - Validade */}
          <div className="bg-white dark:bg-zinc-900 border-3 border-black rounded-[40px] p-6 neo-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Cláusula 05</span>
              <span className="material-icons-outlined text-slate-300 text-xl">event</span>
            </div>
            <h3 className="font-display font-black text-2xl mb-4 text-black dark:text-white">Da Validade</h3>
            <div className="grid grid-cols-2 gap-3">
              {['Indeterminado', '1 Mês', '3 Meses', '1 Ano'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setValidity(val)}
                  className={`py-3 rounded-2xl border-2 border-black font-bold text-xs transition-all ${validity === val ? 'bg-accent-yellow shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-transparent'
                    }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-8 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light/95 dark:via-background-dark/95 to-transparent z-40">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-primary rounded-full border-3 border-black neo-shadow active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="font-display font-black text-xl uppercase tracking-tighter">CRIANDO...</span>
              ) : (
                <>
                  <span className="material-icons-outlined font-black text-2xl">check</span>
                  <span className="font-display font-black text-xl uppercase tracking-tighter">CRIAR ACORDO</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* IA Suggestions Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative w-full max-w-[380px] bg-white dark:bg-zinc-900 border-4 border-black rounded-[40px] p-8 neo-shadow !shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200">
            <button
              onClick={closeModal}
              className="absolute -top-4 -right-4 w-12 h-12 bg-accent-pink border-3 border-black rounded-full flex items-center justify-center neo-shadow !shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
            >
              <span className="material-icons-outlined text-black font-black">close</span>
            </button>

            <div className="flex items-center gap-2 mb-6">
              <span className="material-icons-outlined text-primary text-2xl">auto_awesome</span>
              <h2 className="text-2xl font-black tracking-tighter leading-none text-black dark:text-white uppercase">
                {modalType === 'rules' ? 'Regras da IA' : 'Multas da IA'}
              </h2>
            </div>

            {modalLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 border-4 border-black border-t-primary rounded-full animate-spin"></div>
                <p className="font-black text-[10px] uppercase tracking-widest text-gray-400 animate-pulse">A IA está pensando...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-500 mb-4">Escolha uma opção para adicionar:</p>
                {aiSuggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectSuggestion(s)}
                    className="w-full text-left p-5 bg-slate-50 dark:bg-zinc-800 border-2 border-black rounded-[24px] hover:bg-primary/20 hover:border-primary transition-all group flex items-start gap-3"
                  >
                    <span className="text-primary font-black mt-0.5">•</span>
                    <span className="text-sm font-bold leading-snug">{s}</span>
                  </button>
                ))}
                {aiSuggestions.length === 0 && !modalLoading && (
                  <p className="text-center py-4 text-xs font-bold text-red-500">Ops! Não consegui gerar sugestões agora. Tente de novo!</p>
                )}
              </div>
            )}

            <button
              onClick={closeModal}
              className="w-full mt-8 py-4 bg-black text-white dark:bg-white dark:text-black rounded-full font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95"
            >
              FECHAR
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default NewAgreement;
