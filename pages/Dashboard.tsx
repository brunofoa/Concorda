
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import { generateDailyTip } from '../services/openaiService';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agreements, setAgreements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ active: 0, completed: 0 });

  // Daily Tip State
  const [dailyTip, setDailyTip] = useState<any>(null);
  const [loadingTip, setLoadingTip] = useState(true);

  // Fetch agreements from Supabase
  React.useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // 1. Fetch Active Agreements (Recent List)
        const { data: activeData, error: activeError } = await supabase
          .from('agreements')
          .select(`
            *,
            agreement_participants (name)
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(5);

        if (activeError) console.error('Error fetching agreements:', activeError);
        else setAgreements(activeData || []);

        // 2. Fetch Counts
        const { count: activeCount, error: countActiveError } = await supabase
          .from('agreements')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        const { count: completedCount, error: countCompletedError } = await supabase
          .from('agreements')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'completed');

        if (!countActiveError && !countCompletedError) {
          setStats({
            active: activeCount || 0,
            completed: completedCount || 0
          });
        }

      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Fetch or Generate Daily Tip
  React.useEffect(() => {
    const handleDailyTip = async () => {
      const today = new Date().toISOString().split('T')[0];

      try {
        // 1. Check if tip exists for today
        const { data: existingTip, error: fetchError } = await supabase
          .from('tips')
          .select('*')
          .eq('display_date', today)
          .single();

        if (existingTip) {
          setDailyTip(existingTip);
          setLoadingTip(false);
          return;
        }

        // 2. If not, generate new one
        console.log("Generating new daily tip...");
        const generatedTip = await generateDailyTip();

        if (generatedTip) {
          // Flatten structure for saving: title/category as columns, rest as JSON string in content
          const contentToSave = JSON.stringify({
            intro: generatedTip.intro,
            steps: generatedTip.steps,
            conclusion: generatedTip.conclusion
          });

          const { data: newTip, error: insertError } = await supabase
            .from('tips')
            .insert({
              title: generatedTip.title,
              content: contentToSave,
              category: generatedTip.category,
              display_date: today
            })
            .select()
            .single();

          if (!insertError) {
            setDailyTip(newTip);
          }
        }

      } catch (err: any) {
        console.error("Error handling daily tip:", err);
      } finally {
        setLoadingTip(false);
      }
    };

    handleDailyTip();
  }, []);

  const toggleModal = () => setIsModalOpen(!isModalOpen);



  const pendingCount = stats.active;
  // Use metadata name or email username
  const userName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuário';

  return (
    <Layout>
      <div className="px-6 space-y-8 pb-12">
        <section className="mt-6">
          <div className="flex items-center gap-3 mb-1">
            <span className="w-8 h-[3px] bg-primary rounded-full"></span>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Bem-vindo de volta</p>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight leading-none mb-2">Olá, {userName}!</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Você tem <span className="text-black dark:text-white font-bold underline decoration-primary decoration-4">{pendingCount} {pendingCount === 1 ? 'acordo' : 'acordos'}</span> ativos.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4">
          {/* Daily Tip Card */}
          <div onClick={toggleModal} className="relative w-full aspect-[21/10] bg-card-blue dark:bg-indigo-950 border-3 border-black neo-shadow rounded-[32px] overflow-hidden flex items-center p-6 group cursor-pointer transition-transform active:scale-[0.98]">
            <div className="z-10 w-full pr-4">
              <span className="text-[9px] font-black uppercase tracking-widest bg-black text-white px-2 py-1 rounded-md mb-3 inline-block">
                {dailyTip?.category || 'Dica do Dia'}
              </span>
              <h2 className="text-2xl font-black text-black dark:text-white mb-4 leading-tight">
                {loadingTip ? 'Carregando dica...' : dailyTip?.title || 'Dica indisponível hoje'}
              </h2>
              <Link to="/tips" className="inline-block mt-4">
                <button
                  className="bg-white text-black px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-wider neo-brutalism !shadow-none !border-2 hover:bg-slate-50 transition-colors"
                >
                  LER ARTIGO
                </button>
              </Link>
            </div>
          </div>

          <Link to="/library" className="block relative w-full bg-accent-purple border-3 border-black neo-shadow rounded-[32px] p-6 active:scale-[0.98] transition-all overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:rotate-12 transition-transform duration-500">
              <span className="material-icons-outlined text-9xl">auto_awesome_motion</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-icons-outlined text-black">explore</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-black/60">Novidade</span>
              </div>
              <h3 className="text-2xl font-black text-black leading-none mb-1">Biblioteca de Modelos</h3>
              <p className="text-black/60 font-bold text-xs uppercase tracking-tight">Comece com acordos prontos e testados.</p>
            </div>
          </Link>
        </section>

        <section>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-xl font-black uppercase tracking-tighter">Seu Radar</h3>
            <Link to="/history" className="text-xs font-black text-primary flex items-center gap-1">
              HISTÓRICO <span className="material-icons-outlined text-sm">north_east</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-zinc-900 p-5 border-3 border-black neo-shadow rounded-[28px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-icons-outlined text-primary text-lg">fact_check</span>
                <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-black uppercase tracking-wider">Cumpridos</span>
              </div>
              <p className="text-4xl font-black mt-1">{stats.completed}</p>
            </div>
            <div className="bg-primary p-5 border-3 border-black neo-shadow rounded-[28px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-icons-outlined text-black text-lg">bolt</span>
                <span className="text-black/40 text-[10px] font-black uppercase tracking-wider">Ativos</span>
              </div>
              <p className="text-4xl font-black text-black mt-1">{loading ? '...' : pendingCount}</p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-xl font-black uppercase tracking-tighter">Acordos Recentes</h3>
            <Link to="/history">
              <button className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center hover:bg-slate-100 transition-colors">
                <span className="material-icons-outlined text-sm text-black dark:text-white">arrow_forward</span>
              </button>
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-gray-500 text-sm py-4">Carregando acordos...</p>
            ) : agreements.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 dark:bg-zinc-800/50 rounded-[32px] border-2 border-dashed border-gray-300 dark:border-zinc-700">
                <p className="text-gray-400 font-bold mb-2">Nenhum acordo ativo</p>
                <Link to="/new" className="text-xs font-black text-primary uppercase underline">Criar meu primeiro acordo</Link>
              </div>
            ) : (
              agreements.map((agreement) => (
                <Link key={agreement.id} to={`/details/${agreement.id}`} className="block bg-white dark:bg-zinc-900 p-5 border-3 border-black neo-shadow rounded-[32px] flex justify-between items-center group active:translate-x-1 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-zinc-800 rounded-2xl border-2 border-black flex items-center justify-center">
                      <span className="material-icons-outlined text-black dark:text-white">
                        description
                      </span>
                    </div>
                    <div>
                      <h4 className="font-black text-lg leading-tight text-black dark:text-white line-clamp-1">{agreement.title || 'Acordo sem título'}</h4>
                      <p className="text-black/50 dark:text-white/50 text-[10px] font-bold uppercase tracking-wider mt-1 line-clamp-1">
                        {agreement.agreement_participants && agreement.agreement_participants.length > 0
                          ? `Com: ${agreement.agreement_participants.map((p: any) => p.name).join(', ')}`
                          : 'Sem participantes'}
                      </p>
                    </div>
                  </div>
                  <span className="material-icons-outlined text-black/20 group-hover:text-black transition-colors">chevron_right</span>
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="pt-4 pb-8">
          <Link to="/new">
            <button className="w-full py-5 rounded-full bg-primary border-3 border-black text-black font-black text-xl neo-shadow active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 group">
              <span className="material-icons-outlined font-black text-2xl group-hover:rotate-90 transition-transform duration-300 text-black">add_circle</span>
              <span className="text-black">NOVO ACORDO</span>
            </button>
          </Link>
        </section>
      </div>

      {/* Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={toggleModal}
          ></div>
          <div className="relative w-full max-w-[380px] bg-white dark:bg-zinc-900 border-4 border-black rounded-[40px] p-8 neo-shadow !shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200">
            <button
              onClick={toggleModal}
              className="absolute -top-4 -right-4 w-12 h-12 bg-accent-pink border-3 border-black rounded-full flex items-center justify-center neo-shadow !shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
            >
              <span className="material-icons-outlined text-black font-black">close</span>
            </button>

            {/* Header: Categoria */}
            <span className="text-xs font-bold uppercase tracking-wide bg-green-400 text-black px-3 py-1 rounded-full mb-4 inline-block border border-black/10">
              {dailyTip?.category || 'Dica Geral'}
            </span>

            {/* Título */}
            <h2 className="text-3xl font-black tracking-tighter leading-none mb-6 text-black dark:text-white">
              {dailyTip?.title}
            </h2>

            {/* Corpo */}
            <div className="space-y-6">
              {/* Intro */}
              <p className="text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {(() => {
                  try {
                    const parsed = JSON.parse(dailyTip?.content || '{}');
                    return parsed.intro || dailyTip?.content;
                  } catch { return dailyTip?.content; }
                })()}
              </p>

              {/* Steps List */}
              <ul className="space-y-3">
                {(() => {
                  try {
                    const parsed = JSON.parse(dailyTip?.content || '{}');
                    if (parsed.steps && Array.isArray(parsed.steps)) {
                      return parsed.steps.map((step: any, index: number) => (
                        <li key={index} className="flex gap-3 items-start">
                          <span className="text-green-600 dark:text-green-400 font-black text-lg pt-0.5">{step.id}.</span>
                          <span className="text-slate-700 dark:text-slate-200 leading-relaxed">
                            <strong className="text-black dark:text-white font-bold">{step.bold}</strong> {step.text}
                          </span>
                        </li>
                      ));
                    }
                    return null;
                  } catch { return null; }
                })()}
              </ul>

              {/* Conclusion (Footer) */}
              <div className="pt-4 border-t border-slate-200 dark:border-zinc-800">
                <p className="text-sm text-slate-400 italic">
                  {(() => {
                    try {
                      const parsed = JSON.parse(dailyTip?.content || '{}');
                      return parsed.conclusion;
                    } catch { return "Dica Concorda"; }
                  })()}
                </p>
              </div>
            </div>

            <button
              onClick={toggleModal}
              className="w-full mt-8 py-4 bg-black text-white dark:bg-white dark:text-black rounded-full font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95"
            >
              ENTENDIDO!
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
