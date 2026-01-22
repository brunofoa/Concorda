
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../services/supabase';
import { Profile as ProfileType } from '../types';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle(); // Use maybeSingle to avoid error on 406/no rows

        if (error) {
          console.error("Error fetching profile:", error);
        }

        if (data) {
          setProfile(data);
          const [firstName, ...lastNameParts] = (data.full_name || '').split(' ');
          setFormData({
            firstName: firstName || '',
            lastName: lastNameParts.join(' ') || '',
            phone: data.phone || '',
          });
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('No user logged in');

      const full_name = `${formData.firstName} ${formData.lastName}`.trim();

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name,
          avatar_url: profile?.avatar_url || '',
          phone: formData.phone,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      await fetchProfile();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getInitials = (name: string | null | undefined) => {
    return (name || '').charAt(0).toUpperCase() || '?';
  };

  if (loading && !profile) {
    return (
      <Layout title="Meu Perfil">
        <div className="flex justify-center items-center h-full">
          Carregando...
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Meu Perfil">
      <div className="px-6 space-y-8 pb-12 flex flex-col items-center">
        <div className="relative mt-8">
          <div className="w-36 h-36 border-3 border-black neo-shadow rounded-[40px] overflow-hidden bg-accent-yellow flex items-center justify-center !shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <span className="font-black text-black text-6xl">
              {profile ? getInitials(profile.full_name) : 'U'}
            </span>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-zinc-800 border-2 border-black rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform"
          >
            <span className="material-icons-outlined text-sm">{isEditing ? 'close' : 'edit'}</span>
          </button>
        </div>

        <h2 className="text-2xl font-[900] text-black dark:text-white">
          {profile?.full_name || 'Usuário'}
        </h2>

        <div className="w-full space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-500 ml-1">Nome</label>
            <div className="bg-white dark:bg-zinc-900 border-2 border-black rounded-2xl p-4 flex items-center gap-2">
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none font-bold text-black dark:text-white"
                  placeholder="Nome"
                />
              ) : (
                <span className="font-bold text-black dark:text-white">{formData.firstName}</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-500 ml-1">Sobrenome</label>
            <div className="bg-white dark:bg-zinc-900 border-2 border-black rounded-2xl p-4 flex items-center gap-2">
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none font-bold text-black dark:text-white"
                  placeholder="Sobrenome"
                />
              ) : (
                <span className="font-bold text-black dark:text-white">{formData.lastName}</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-500 ml-1">E-mail</label>
            <div className="bg-white dark:bg-zinc-900 border-2 border-black rounded-2xl p-4 flex items-center gap-2 opacity-70">
              <span className="material-icons-outlined text-gray-400 text-sm">mail</span>
              <span className="font-bold text-black dark:text-white">{profile?.email || '...'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-500 ml-1">Telefone</label>
            <div className="bg-white dark:bg-zinc-900 border-2 border-black rounded-2xl p-4 flex items-center gap-2">
              <span className="material-icons-outlined text-gray-400 text-sm">phone</span>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none font-bold text-black dark:text-white"
                  placeholder="+55 (11) 99999-9999"
                />
              ) : (
                <span className="font-bold text-black dark:text-white">{formData.phone || 'Sem telefone'}</span>
              )}
            </div>
          </div>

          <div className="pt-4">
            {isEditing && (
              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full gradient-btn text-black font-black text-lg py-4 rounded-full border-2 border-black neo-shadow active:translate-y-1 active:translate-x-1 active:shadow-none transition-all uppercase tracking-wider mb-4 disabled:opacity-50"
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            )}

            <button
              onClick={() => document.documentElement.classList.toggle('dark')}
              className="w-full bg-white dark:bg-zinc-800 border-2 border-black py-3 rounded-2xl font-bold flex items-center justify-center gap-2"
            >
              <span className="material-icons-outlined">contrast</span>
              Alternar Tema
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
