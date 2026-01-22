import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { supabase } from '../services/supabase';

const TipsLibrary: React.FC = () => {
    const [tips, setTips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTip, setSelectedTip] = useState<any>(null);

    useEffect(() => {
        const fetchTips = async () => {
            try {
                const { data, error } = await supabase
                    .from('tips')
                    .select('*')
                    .order('display_date', { ascending: false });

                if (error) throw error;
                setTips(data || []);
            } catch (err) {
                console.error("Error fetching tips history:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTips();
    }, []);

    const openTip = (tip: any) => setSelectedTip(tip);
    const closeTip = () => setSelectedTip(null);

    return (
        <Layout title="Biblioteca de Dicas">
            <div className="px-6 pb-20 max-w-xl mx-auto">
                <div className="flex items-center gap-3 mb-8 mt-4">
                    <Link to="/dashboard" className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center hover:bg-slate-100 transition-colors bg-white">
                        <span className="material-icons-outlined text-black">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight leading-none text-black dark:text-white">
                            Sabedoria Diária
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">
                            Coleção de dicas para uma convivência épica.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <p className="text-center py-12 text-gray-500">Carregando biblioteca...</p>
                ) : tips.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-gray-300">
                        <p className="font-bold text-gray-400">Nenhuma dica salva ainda.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {tips.map((tip) => (
                            <button
                                key={tip.id}
                                onClick={() => openTip(tip)}
                                className="w-full bg-white dark:bg-zinc-900 p-4 border-3 border-black neo-shadow rounded-[24px] flex items-center justify-between group active:scale-[0.98] transition-transform"
                            >
                                <div className="flex items-center gap-4 text-left">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-zinc-800 rounded-full border-2 border-black flex items-center justify-center flex-shrink-0">
                                        <span className="material-icons-outlined text-black dark:text-white">lightbulb</span>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg leading-tight text-black dark:text-white line-clamp-1">{tip.title}</h3>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                                            {new Date(tip.display_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <span className="material-icons-outlined text-slate-300 group-hover:text-black transition-colors">chevron_right</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Tip Detail Modal */}
            {selectedTip && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={closeTip}
                    ></div>
                    <div className="relative w-full max-w-[380px] bg-white dark:bg-zinc-900 border-4 border-black rounded-[40px] p-8 neo-shadow !shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200">
                        <button
                            onClick={closeTip}
                            className="absolute -top-4 -right-4 w-12 h-12 bg-accent-pink border-3 border-black rounded-full flex items-center justify-center neo-shadow !shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
                        >
                            <span className="material-icons-outlined text-black font-black">close</span>
                        </button>

                        {/* Header: Categoria */}
                        <span className="text-xs font-bold uppercase tracking-wide bg-green-400 text-black px-3 py-1 rounded-full mb-4 inline-block border border-black/10">
                            {selectedTip.category || 'Dica Geral'}
                        </span>

                        {/* Título */}
                        <h2 className="text-3xl font-black tracking-tighter leading-none mb-6 text-black dark:text-white">
                            {selectedTip.title}
                        </h2>

                        {/* Corpo */}
                        <div className="space-y-6">
                            {/* Intro */}
                            <p className="text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                {(() => {
                                    try {
                                        const parsed = JSON.parse(selectedTip.content || '{}');
                                        return parsed.intro || selectedTip.content;
                                    } catch { return selectedTip.content; }
                                })()}
                            </p>

                            {/* Steps List */}
                            <ul className="space-y-3">
                                {(() => {
                                    try {
                                        const parsed = JSON.parse(selectedTip.content || '{}');
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
                                            const parsed = JSON.parse(selectedTip.content || '{}');
                                            return parsed.conclusion;
                                        } catch { return "Dica Concorda"; }
                                    })()}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={closeTip}
                            className="w-full mt-8 py-4 bg-black text-white dark:bg-white dark:text-black rounded-full font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
                        >
                            ENTENDIDO!
                        </button>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default TipsLibrary;
