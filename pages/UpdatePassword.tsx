
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

const UpdatePassword: React.FC = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            alert('Senha atualizada com sucesso!');
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Erro ao atualizar a senha.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-8 transition-colors">
            <div className="w-full max-w-md">
                <div className="mb-12 text-center">
                    <h1 className="font-display text-4xl font-black text-black dark:text-white tracking-tighter">
                        Criar Nova Senha
                    </h1>
                    <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
                        Digite sua nova senha abaixo.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl neo-brutalism border-2 border-red-900">
                        {error}
                    </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-6">
                    <div>
                        <label className="block mb-2 ml-1 text-xs font-bold text-black dark:text-white uppercase tracking-wider">Nova Senha</label>
                        <div className="bg-white dark:bg-zinc-900 neo-brutalism rounded-3xl flex items-center px-4 py-1">
                            <span className="material-icons-outlined text-gray-400 mr-3">lock</span>
                            <input
                                className="w-full bg-transparent border-none focus:ring-0 py-3 text-black dark:text-white placeholder:text-gray-400 font-medium"
                                placeholder="••••••••"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full gradient-btn neo-brutalism rounded-full py-5 flex items-center justify-center gap-2 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="font-display text-lg font-black text-black tracking-widest uppercase">
                                {loading ? 'Salvando...' : 'Salvar Nova Senha'}
                            </span>
                            {!loading && <span className="material-icons-outlined font-black text-black">check</span>}
                        </button>
                    </div>
                </form>
            </div>

            <button
                className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-white dark:bg-zinc-800 neo-brutalism flex items-center justify-center z-50"
                onClick={() => document.documentElement.classList.toggle('dark')}
            >
                <span className="material-icons-outlined text-black dark:text-white">contrast</span>
            </button>
        </div>
    );
};

export default UpdatePassword;
