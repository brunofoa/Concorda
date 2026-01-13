import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import Layout from '../components/Layout';
import { supabase } from '../services/supabase';
import { AgreementStatus } from '../types';

type ClosureType = 'success' | 'fail' | 'extend' | null;

const AgreementDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [agreement, setAgreement] = useState<any>(null);

  // Modal & Flow State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [closureType, setClosureType] = useState<ClosureType>(null);
  const [step, setStep] = useState(0); // 0: Select, 1: Action

  // Signature State
  const sigCanvasRefs = useRef<any[]>([]);
  const [signatures, setSignatures] = useState<{ [key: string]: string }>({});

  // Extension State
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    fetchAgreement();
  }, [id]);

  const fetchAgreement = async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from('agreements')
        .select(`*, agreement_participants (*), agreement_rules (*)`)
        .eq('id', id)
        .single();

      if (error) throw error;
      setAgreement(data);
    } catch (err) {
      console.error(err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSignature = (participantIndex: number) => {
    const canvas = sigCanvasRefs.current[participantIndex];
    if (!canvas || canvas.isEmpty()) return;

    const participantId = agreement.agreement_participants[participantIndex]?.id || `p${participantIndex}`;
    const sigData = canvas.toDataURL();
    setSignatures(prev => ({ ...prev, [participantId]: sigData }));
  };

  const clearSignature = (index: number) => {
    const canvas = sigCanvasRefs.current[index];
    if (canvas) canvas.clear();
  };

  const handleFinishSuccess = async () => {
    try {
      const updates = {
        status: 'completed',
        signatures: signatures, // JSONB
        completed_at: new Date().toISOString(),
      };

      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v !== undefined && v !== "" && v !== null)
      );

      console.log('Payload to save (Success):', cleanUpdates);

      const { error } = await supabase
        .from('agreements')
        .update(cleanUpdates)
        .eq('id', id);

      if (error) throw error;
      alert('Parabéns! Acordo selado e missão cumprida! 🚀');
      navigate('/history');
    } catch (err: any) {
      console.error('Error saving agreement:', err);
      alert(`Erro ao salvar: ${err.message || 'Erro desconhecido'}`);
    }
  };

  const handleFinishFail = async () => {
    try {
      const updates = {
        status: 'failed',
        signatures: signatures,
        completed_at: new Date().toISOString(),
      };

      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v !== undefined && v !== "" && v !== null)
      );

      console.log('Payload to save (Fail):', cleanUpdates);

      const { error } = await supabase
        .from('agreements')
        .update(cleanUpdates)
        .eq('id', id);

      if (error) throw error;
      alert('Acordo encerrado com multa aplicada. 💸');
      navigate('/history');
    } catch (err: any) {
      console.error('Error saving agreement:', err);
      alert(`Erro ao salvar: ${err.message || 'Erro desconhecido'}`);
    }
  };

  const handleExtension = async () => {
    if (!newDate) return;
    try {
      const { error } = await supabase.rpc('increment_negotiation', { row_id: id, new_validity: newDate });

      if (error) {
        await supabase
          .from('agreements')
          .update({
            validity: newDate,
            negotiation_count: (agreement.negotiation_count || 0) + 1
          })
          .eq('id', id);
      }

      alert('Acordo renovado! 🔄');
      setIsModalOpen(false);
      setClosureType(null);
      fetchAgreement();
    } catch (err) {
      console.error(err);
      alert('Erro ao renovar.');
    }

  };

  const handleRatification = async () => {
    const p1 = participants[0];
    const p2 = participants[1];

    // Fallback IDs if participants not loaded correctly (shouldn't happen if created correctly)
    const id1 = p1?.id || 'p0';
    const id2 = p2?.id || 'p1';

    const sig1 = signatures[id1];
    const sig2 = signatures[id2];

    if (!sig1 || !sig2) {
      alert("Ambos os participantes precisam assinar para validar o acordo!");
      return;
    }

    try {
      const { error } = await supabase
        .from('agreements')
        .update({
          initial_signature_creator: sig1,
          initial_signature_partner: sig2,
          signed_at: new Date().toISOString(),
          status: 'active'
        })
        .eq('id', id);

      if (error) throw error;

      alert("Acordo Validado com Sucesso! 🥂");
      fetchAgreement();
      // Scroll to top
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Error signing agreement:', err);
      alert('Erro ao salvar assinaturas.');
    }
  };

  if (loading) return <Layout><div className="p-8 text-center">Carregando...</div></Layout>;
  if (!agreement) return null;

  const participants = agreement.agreement_participants || [];

  return (
    <Layout title="Detalhes do Acordo">
      <div className="px-6 pb-40 max-w-2xl mx-auto font-display">

        {/* Main Document Card - Neo Brutalism Style */}
        <div className="bg-white dark:bg-zinc-900 rounded-[40px] border-3 border-black p-8 relative neo-shadow space-y-8">

          {/* 1. Header Section */}
          <div className="text-center sm:text-left space-y-2">
            {/* Data */}
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
              Criado em {new Date(agreement.created_at).toLocaleDateString()}
            </span>

            {/* Título */}
            <h1 className="text-3xl font-black text-black dark:text-white leading-tight uppercase tracking-tight">
              {agreement.title}
            </h1>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-2">
              {agreement.category && (
                <span className="px-4 py-1.5 rounded-full border-2 border-black font-black text-[10px] uppercase tracking-widest bg-white text-black">
                  {agreement.category}
                </span>
              )}
              <span className={`px-4 py-1.5 rounded-full border-2 border-black font-black text-[10px] uppercase tracking-widest ${agreement.status === 'active' ? 'bg-emerald-300' :
                agreement.status === 'completed' ? 'bg-blue-300' :
                  agreement.status === 'failed' ? 'bg-red-300' :
                    agreement.status === 'waiting_signatures' ? 'bg-yellow-300' : 'bg-gray-200'
                }`}>
                {agreement.status === 'active' ? 'Em Vigor' :
                  agreement.status === 'waiting_signatures' ? 'Aguardando Assinaturas' :
                    agreement.status === 'completed' ? 'Missão Cumprida' : agreement.status}
              </span>
            </div>
          </div>

          <div className="w-full h-0.5 bg-black/5 rounded-full"></div>

          {/* 2. Participantes */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
              <span className="material-icons-outlined text-sm">group</span>
              Participantes
            </h3>
            <div className="flex flex-wrap gap-3">
              {participants.map((p: any) => (
                <div key={p.id} className="bg-slate-50 dark:bg-zinc-800 border-2 border-black rounded-xl px-4 py-2">
                  <span className="text-sm font-black text-black dark:text-white uppercase">{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. O Compromisso */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
              <span className="material-icons-outlined text-sm">edit_note</span>
              O Compromisso
            </h3>
            <div className="p-4 bg-slate-50 dark:bg-zinc-800 border-2 border-black rounded-2xl">
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-relaxed">
                {agreement.description}
              </p>
            </div>
          </div>

          {/* 4. Regras (Extra, mantendo por ser do modelo de dados, mas discreto) */}
          {agreement.agreement_rules?.length > 0 && (
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                <span className="material-icons-outlined text-sm">rule</span>
                Regras
              </h3>
              <ul className="space-y-2 pl-2">
                {agreement.agreement_rules.map((r: any, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
                    <span>{r.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 5. A Multa */}
          {agreement.penalty && (
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-3 flex items-center gap-2">
                <span className="material-icons-outlined text-sm text-red-500">sentiment_very_dissatisfied</span>
                A Multa
              </h3>
              <div className="p-4 bg-red-50 dark:bg-red-900/10 border-2 border-black rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <span className="material-icons-outlined text-6xl">gavel</span>
                </div>
                <p className="text-sm font-black text-red-600 dark:text-red-400 relative z-10">{agreement.penalty}</p>
              </div>
            </div>
          )}

          {/* 6. Vigência */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-3 flex items-center gap-2">
              <span className="material-icons-outlined text-sm text-purple-500">event</span>
              Vigência
            </h3>
            <div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-900/10 border-2 border-black rounded-xl p-3 w-fit">
              <p className="text-sm font-black text-purple-700 dark:text-purple-300">{agreement.validity}</p>
              {agreement.negotiation_count > 0 && (
                <span className="text-[9px] bg-white border border-purple-200 px-2 py-0.5 rounded text-purple-700 font-bold">
                  + {agreement.negotiation_count} renegociações
                </span>
              )}
            </div>
          </div>

          <div className="w-full h-0.5 bg-black/5 rounded-full"></div>

          {/* 7. Assinaturas (Footer do Card) */}
          <div className="pt-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 text-center">Assinaturas do Acordo</h3>

            {/* Caso A: Já Assinado (Ativo/Concluído/Falhou) */}
            {(agreement.status === 'active' || agreement.status === 'completed' || agreement.status === 'failed') && (
              <div className="flex justify-between items-end gap-6">
                {/* Assinatura 1 */}
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="h-20 w-full flex items-center justify-center border-b-2 border-black/10 pb-2">
                    {agreement.initial_signature_creator ? (
                      <img src={agreement.initial_signature_creator} className="h-full object-contain" alt="Assinatura Contratante" />
                    ) : <span className="text-xs text-gray-300 font-bold italic">Sem assinatura</span>}
                  </div>
                  <span className="text-[8px] uppercase font-black tracking-widest text-gray-400">Participante 1</span>
                </div>

                {/* Ícone de aperto de mão ou link */}
                <div className="text-gray-200 pb-6">
                  <span className="material-icons-outlined">handshake</span>
                </div>

                {/* Assinatura 2 */}
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="h-20 w-full flex items-center justify-center border-b-2 border-black/10 pb-2">
                    {agreement.initial_signature_partner ? (
                      <img src={agreement.initial_signature_partner} className="h-full object-contain" alt="Assinatura Parceiro" />
                    ) : <span className="text-xs text-gray-300 font-bold italic">Sem assinatura</span>}
                  </div>
                  <span className="text-[8px] uppercase font-black tracking-widest text-gray-400">Participante 2</span>
                </div>
              </div>
            )}

            {/* Caso B: Aguardando Assinaturas (Ratificação) */}
            {agreement.status === 'waiting_signatures' && (
              <div className="space-y-6">
                <div className="bg-yellow-100 border-2 border-black p-4 rounded-2xl flex gap-3 items-center">
                  <span className="material-icons-outlined text-yellow-700">warning</span>
                  <p className="text-xs text-yellow-800 font-bold leading-tight">
                    Para valer, todos devem assinar abaixo.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {participants.map((p: any, i: number) => {
                    return (
                      <div key={p.id || i} className="relative">
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 pl-1 text-primary">
                          {p.name || `Participante ${i + 1}`}
                        </label>
                        <div className="h-32 bg-white rounded-2xl border-2 border-dashed border-gray-300 relative overflow-hidden group hover:border-black transition-colors">
                          <SignatureCanvas
                            ref={(el) => { if (el) sigCanvasRefs.current[i] = el }}
                            penColor="black"
                            canvasProps={{ className: 'signature-canvas w-full h-full' }}
                            onEnd={() => handleSaveSignature(i)}
                          />
                          <div className="absolute top-2 right-2 pointer-events-none">
                            <span className="material-icons-outlined text-gray-200">draw</span>
                          </div>
                          <button
                            onClick={() => clearSignature(i)}
                            className="absolute bottom-2 right-2 p-2 bg-slate-100 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors z-10"
                            title="Limpar"
                          >
                            <span className="material-icons-outlined text-sm font-bold">delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={handleRatification}
                  className="w-full py-4 bg-black text-white rounded-full border-2 border-white font-black uppercase tracking-widest hover:scale-[1.01] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  <span className="material-icons-outlined">verified</span>
                  Assinar e Validar Tudo
                </button>
              </div>
            )}

            {/* Assinaturas de Encerramento (se houver) */}
            {(agreement.status === 'completed' || agreement.status === 'failed') && agreement.signatures && (
              <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-200">
                <p className="text-center text-[9px] font-black uppercase text-gray-300 tracking-widest mb-4">Registro de Encerramento</p>
                <div className="flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                  {Object.values(agreement.signatures).map((s: any, k) => (
                    <img key={k} src={s} className="h-10 border-b border-black" title="Assinatura de Encerramento" />
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Floating Action Button (Outside Card - Footer) */}
        {agreement.status === 'active' && (
          <div className="fixed bottom-0 left-0 w-full p-6 pointer-events-none flex justify-center z-50">
            <button
              onClick={() => { setIsModalOpen(true); setStep(0); }}
              className="pointer-events-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-primary text-black border-2 border-black px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-3"
            >
              <span className="material-icons-outlined">edit_square</span>
              Encerrar ou Atualizar
            </button>
          </div>
        )}
      </div>

      {/* Modal Overlay (Generic for closure logic) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[32px] border-4 border-black p-6 neo-shadow animate-slide-up relative max-h-[90vh] overflow-y-auto">

            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
              <span className="material-icons-outlined">close</span>
            </button>

            {/* Step 0: Selection */}
            {step === 0 && (
              <div className="space-y-4 pt-4">
                <h2 className="text-xl font-black text-center mb-6 uppercase tracking-tight">Qual o desfecho?</h2>

                <button onClick={() => { setClosureType('success'); setStep(1); }} className="w-full p-4 rounded-2xl border-2 border-black bg-emerald-100 hover:bg-emerald-200 flex items-center gap-4 transition-colors group">
                  <div className="w-12 h-12 bg-emerald-400 rounded-full border-2 border-black flex items-center justify-center text-xl group-hover:scale-110 transition-transform">✅</div>
                  <div className="text-left">
                    <div className="font-black uppercase tracking-wide">Missão Cumprida</div>
                  </div>
                </button>

                <button onClick={() => { setClosureType('fail'); setStep(1); }} className="w-full p-4 rounded-2xl border-2 border-black bg-red-100 hover:bg-red-200 flex items-center gap-4 transition-colors group">
                  <div className="w-12 h-12 bg-red-400 rounded-full border-2 border-black flex items-center justify-center text-xl group-hover:scale-110 transition-transform">❌</div>
                  <div className="text-left">
                    <div className="font-black uppercase tracking-wide">Deu Ruim (Multa)</div>
                  </div>
                </button>

                <button onClick={() => { setClosureType('extend'); setStep(1); }} className="w-full p-4 rounded-2xl border-2 border-black bg-yellow-100 hover:bg-yellow-200 flex items-center gap-4 transition-colors group">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full border-2 border-black flex items-center justify-center text-xl group-hover:scale-110 transition-transform">🔄</div>
                  <div className="text-left">
                    <div className="font-black uppercase tracking-wide">Prorrogar</div>
                  </div>
                </button>
              </div>
            )}

            {/* Step 1: Success Flow */}
            {step === 1 && closureType === 'success' && (
              <div className="space-y-6 pt-2">
                <h3 className="text-lg font-black text-center uppercase text-emerald-600">Confirmação Final</h3>
                <p className="text-xs text-center font-bold text-gray-500">Assine para selar o sucesso da missão.</p>

                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                  {participants.map((p: any, i: number) => (
                    <div key={i} className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 pl-2">{p.name} - Assine aqui</label>
                      <div className="border-2 border-black rounded-xl bg-white h-24 relative overflow-hidden">
                        <SignatureCanvas
                          ref={(el) => { if (el) sigCanvasRefs.current[i] = el }}
                          penColor="black"
                          canvasProps={{ className: 'signature-canvas w-full h-full' }}
                          onEnd={() => handleSaveSignature(i)}
                        />
                        <button
                          onClick={() => clearSignature(i)}
                          className="absolute bottom-2 right-2 p-1.5 bg-slate-100 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors z-10"
                          title="Limpar"
                        >
                          <span className="material-icons-outlined text-xs font-bold">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={handleFinishSuccess} className="w-full py-4 rounded-xl bg-emerald-500 text-white font-black border-2 border-black neo-shadow uppercase tracking-widest">
                  Concluir Acordo
                </button>
              </div>
            )}

            {/* Step 1: Fail Flow */}
            {step === 1 && closureType === 'fail' && (
              <div className="space-y-6 pt-2">
                <h3 className="text-lg font-black text-center uppercase text-red-600">Aplicação da Multa</h3>
                <div className="p-4 bg-red-50 border-2 border-black rounded-xl mb-4 text-center neo-shadow">
                  <p className="font-black text-red-600 text-lg">{agreement.penalty}</p>
                </div>
                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                  {participants.map((p: any, i: number) => (
                    <div key={i} className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-red-300 pl-2">{p.name} - Assine a multa</label>
                      <div className="border-2 border-black rounded-xl bg-white h-24 relative overflow-hidden">
                        <SignatureCanvas
                          ref={(el) => { if (el) sigCanvasRefs.current[i] = el }}
                          penColor="red"
                          canvasProps={{ className: 'signature-canvas w-full h-full' }}
                          onEnd={() => handleSaveSignature(i)}
                        />
                        <button
                          onClick={() => clearSignature(i)}
                          className="absolute bottom-2 right-2 p-1.5 bg-slate-100 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors z-10"
                          title="Limpar"
                        >
                          <span className="material-icons-outlined text-xs font-bold">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={handleFinishFail} className="w-full py-4 rounded-xl bg-red-500 text-white font-black border-2 border-black neo-shadow uppercase tracking-widest">
                  Confirmar Multa
                </button>
              </div>
            )}

            {/* Step 1: Extend Flow */}
            {step === 1 && closureType === 'extend' && (
              <div className="space-y-6 pt-2">
                <h3 className="text-lg font-black text-center uppercase text-yellow-600">Novo Prazo</h3>
                <input
                  type="text"
                  placeholder="Ex: +1 Semana"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full p-4 rounded-xl border-2 border-black font-black"
                />
                <button onClick={handleExtension} className="w-full py-4 rounded-xl bg-yellow-400 text-black font-black border-2 border-black neo-shadow uppercase tracking-widest">
                  Renovar Acordo
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </Layout>
  );
};

export default AgreementDetails;
