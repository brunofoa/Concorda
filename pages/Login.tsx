
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password Recovery State
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(recoveryEmail, {
        redirectTo: window.location.origin,
      });

      if (error) throw error;

      alert('Verifique seu e-mail para redefinir a senha!');
      setShowRecoveryModal(false);
      setRecoveryEmail('');
    } catch (err: any) {
      alert(err.message || 'Erro ao enviar e-mail de recuperação.');
    } finally {
      setRecoveryLoading(false);
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
            Seus combinados em um só lugar.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl neo-brutalism border-2 border-red-900">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block mb-2 ml-1 text-xs font-bold text-black dark:text-white uppercase tracking-wider">E-mail</label>
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
            <label className="block mb-2 ml-1 text-xs font-bold text-black dark:text-white uppercase tracking-wider">Senha</label>
            <div className="bg-white dark:bg-zinc-900 neo-brutalism rounded-3xl flex items-center px-4 py-1">
              <span className="material-icons-outlined text-gray-400 mr-3">lock</span>
              <input
                className="w-full bg-transparent border-none focus:ring-0 py-3 text-black dark:text-white placeholder:text-gray-400 font-medium"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>


          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={() => setShowRecoveryModal(true)}
              className="text-sm text-gray-500 hover:underline hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              Esqueceu a senha?
            </button>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-btn neo-brutalism rounded-full py-5 flex items-center justify-center gap-2 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="font-display text-lg font-black text-black tracking-widest uppercase">
                {loading ? 'ENTRANDO...' : 'ENTRAR'}
              </span>
              {!loading && <span className="material-icons-outlined font-black text-black">arrow_forward</span>}
            </button>
          </div>
        </form>

        <div className="text-center mt-8">
          <Link to="/signup" className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            Não tem uma conta? <span className="text-black dark:text-white underline decoration-2 underline-offset-4">Cadastre-se</span>
          </Link>
        </div>
      </div>

      <button
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-white dark:bg-zinc-800 neo-brutalism flex items-center justify-center z-50"
        onClick={() => document.documentElement.classList.toggle('dark')}
      >
        <span className="material-icons-outlined text-black dark:text-white">contrast</span>
      </button>

      {/* Recovery Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-black w-full max-w-sm rounded-2xl neo-brutalism p-6 relative">
            <h2 className="font-display text-2xl font-black text-black dark:text-white mb-4">
              Recuperar Acesso
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Digite seu e-mail para receber o link de redefinição de senha.
            </p>

            <form onSubmit={handleRecovery} className="space-y-4">
              <div>
                <label className="block mb-2 ml-1 text-xs font-bold text-black dark:text-white uppercase tracking-wider">E-mail</label>
                <div className="bg-gray-50 dark:bg-zinc-900 border-2 border-black dark:border-white rounded-xl flex items-center px-4 py-1">
                  <span className="material-icons-outlined text-gray-400 mr-3">mail</span>
                  <input
                    className="w-full bg-transparent border-none focus:ring-0 py-2 text-black dark:text-white placeholder:text-gray-400 font-medium"
                    placeholder="seu@email.com"
                    type="email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRecoveryModal(false)}
                  className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={recoveryLoading}
                  className="flex-1 gradient-btn rounded-xl py-3 font-black text-black uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  {recoveryLoading ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
