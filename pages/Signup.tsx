
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data: { user }, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (signUpError) throw signUpError;

            if (user) {
                const full_name = `${firstName} ${lastName}`.trim();

                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: user.id,
                        email: user.email,
                        full_name,
                        phone,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    });

                if (profileError) {
                    console.error('Error creating profile:', profileError);
                    // Don't block signup if profile creation fails, but log it
                }
            }

            // Auto redirect or show success message depending on email confirmation setting
            // assuming auto sign-in available or just redirect to login
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Erro ao criar conta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-8 transition-colors">
            <div className="w-full max-w-md">
                <div className="mb-12 text-center">
                    <h1 className="font-display text-6xl font-black text-black dark:text-white tracking-tighter">
                        Concorda.
                    </h1>
                    <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
                        Crie sua conta e comece a combinar.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl neo-brutalism border-2 border-red-900">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 ml-1 text-xs font-bold text-black dark:text-white tracking-wider">Nome</label>
                            <div className="bg-white dark:bg-zinc-900 neo-brutalism rounded-3xl flex items-center px-4 py-1">
                                <input
                                    className="w-full bg-transparent border-none focus:ring-0 py-3 text-black dark:text-white placeholder:text-gray-400 font-medium"
                                    placeholder="João"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-2 ml-1 text-xs font-bold text-black dark:text-white tracking-wider">Sobrenome</label>
                            <div className="bg-white dark:bg-zinc-900 neo-brutalism rounded-3xl flex items-center px-4 py-1">
                                <input
                                    className="w-full bg-transparent border-none focus:ring-0 py-3 text-black dark:text-white placeholder:text-gray-400 font-medium"
                                    placeholder="Silva"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 ml-1 text-xs font-bold text-black dark:text-white tracking-wider">Telefone</label>
                        <div className="bg-white dark:bg-zinc-900 neo-brutalism rounded-3xl flex items-center px-4 py-1">
                            <span className="material-icons-outlined text-gray-400 mr-3">phone</span>
                            <input
                                className="w-full bg-transparent border-none focus:ring-0 py-3 text-black dark:text-white placeholder:text-gray-400 font-medium"
                                placeholder="+55 (11) 99999-9999"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 ml-1 text-xs font-bold text-black dark:text-white tracking-wider">E-mail</label>
                        <div className="bg-white dark:bg-zinc-900 neo-brutalism rounded-3xl flex items-center px-4 py-1">
                            <span className="material-icons-outlined text-gray-400 mr-3">mail</span>
                            <input
                                className="w-full bg-transparent border-none focus:ring-0 py-3 text-black dark:text-white placeholder:text-gray-400 font-medium"
                                placeholder="seu@email.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 ml-1 text-xs font-bold text-black dark:text-white tracking-wider">Senha</label>
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
                                {loading ? 'CRIANDO...' : 'CRIAR CONTA'}
                            </span>
                            {!loading && <span className="material-icons-outlined font-black text-black">arrow_forward</span>}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-8">
                    <Link to="/login" className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        Já tem uma conta? <span className="text-black dark:text-white underline decoration-2 underline-offset-4">Entrar</span>
                    </Link>
                </div>
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

export default Signup;
