import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';

const History: React.FC = () => {
  const { user } = useAuth();
  const [agreements, setAgreements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'closed'>('active');

  const fetchAgreements = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('agreements')
        .select(`
          *,
          agreement_participants (name, color)
        `)
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgreements(data || []);
    } catch (error) {
      console.error('Error fetching agreements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, [user]);

  // Filter logic (assuming 'active' status means active, everything else is closed logic for now?)
  // The DB has a 'status' field. Let's assume 'active' is verified/active, and anything else (or specific status) is closed.
  // Actually, let's look at the Mock data: verifying vs pending.
  // Let's assume for now we show all in active unless we have a specific 'closed' status logic.
  // Or maybe we verify 'validity'. For now, let's keep it simple: ALL are active in this MVP unless strictly defined.
  // But wait, user wants tabs. Let's filter by simple status check if we define 'archived' or similar.
  // For now, let's put all in 'active' to ensure they show up, since we haven't implemented 'closing' logic.

  const [activeCategory, setActiveCategory] = useState('Todos');

  const categories = ['Todos', 'Casais', 'Amigos', 'Casa', 'Financeiro', 'Família', 'Outros'];

  const filteredAgreements = agreements.filter(a => {
    // Status filter
    // Active tab shows only 'active'. Closed tab shows everything else (completed, cancelled, etc.)
    const statusMatch = activeTab === 'active' ? a.status === 'active' : a.status !== 'active';

    // Category filter
    const categoryMatch = activeCategory === 'Todos' || a.category === activeCategory;

    return statusMatch && categoryMatch;
  });

  return (
    <Layout title="Meus Acordos">
      <div className="px-6 space-y-6 pb-24">
        {/* Status Tabs */}
        <div className="flex gap-4 mb-2">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all border-2 ${activeTab === 'active'
              ? 'bg-green-400 border-black text-black neo-shadow'
              : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-50'
              }`}
          >
            Ativos
          </button>
          <button
            onClick={() => setActiveTab('closed')}
            className={`flex-1 py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all border-2 ${activeTab === 'closed'
              ? 'bg-green-400 border-black text-black neo-shadow'
              : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-50'
              }`}
          >
            Encerrados
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-2 px-2 pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full border-2 border-black font-black text-[10px] uppercase tracking-widest transition-all ${activeCategory === cat
                ? 'bg-black text-white neo-shadow !shadow-[2px_2px_0px_0px_rgba(74,222,128,1)]'
                : 'bg-white text-black hover:bg-slate-50'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
          </div>
        ) : filteredAgreements.length === 0 ? (
          <div className="text-center py-10 opacity-50">
            <p className="font-bold">Nenhum acordo encontrado.</p>
            <Link to="/new" className="mt-4 inline-block text-primary font-black underline">Criar um agora!</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAgreements.map((agreement) => (
              <Link key={agreement.id} to={`/details/${agreement.id}`} className="block bg-white dark:bg-zinc-900 border-3 border-black rounded-[2.5rem] p-6 neo-shadow hover:-translate-y-1 transition-transform">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    {agreement.category && (
                      <span className="inline-block mb-2 px-2 py-0.5 rounded-full border border-black bg-slate-100 text-black text-[8px] font-black uppercase tracking-widest">
                        {agreement.category}
                      </span>
                    )}
                    <h3 className="text-xl font-bold leading-tight mb-1">{agreement.title || 'Sem Título'}</h3>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                      Criado em {new Date(agreement.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center mt-auto">
                    <div className="flex -space-x-3">
                      {agreement.agreement_participants && agreement.agreement_participants.map((p: any, i: number) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-xs font-black shadow-sm"
                          style={{ backgroundColor: p.color || '#DDD' }}
                        >
                          {(p.name || '?').charAt(0).toUpperCase()}
                        </div>
                      ))}
                    </div>
                    <div className="ml-auto">
                      <span className={`material-icons-outlined ${agreement.status === 'active' || agreement.status === 'verified' ? 'text-emerald-500' : 'text-gray-300'}`}>
                        {agreement.status === 'active' ? 'verified' : 'pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default History;
