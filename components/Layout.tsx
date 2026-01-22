
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, profile } = useAuth();

  const getInitials = () => {
    if (profile?.full_name) return profile.full_name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return '?';
  };

  const isActive = (path: string) => location.pathname === path;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-background-light dark:bg-background-dark flex flex-col relative pb-10 transition-colors overflow-x-hidden">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60] transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed top-0 left-0 h-full w-[280px] bg-white dark:bg-zinc-900 z-[70] border-r-3 border-black transition-transform duration-300 ease-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <img src="/logo.png" alt="Concorda" className="h-20" />
            <button
              onClick={toggleSidebar}
              className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <span className="material-icons-outlined text-black dark:text-white">close</span>
            </button>
          </div>

          <div className="mb-6 flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border-2 border-transparent">
            <div className="w-10 h-10 rounded-full bg-accent-yellow border-2 border-black flex items-center justify-center shrink-0">
              <span className="font-black text-black">{getInitials()}</span>
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm truncate text-black dark:text-white">{profile?.full_name || 'Usuário'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>

          <nav className="space-y-4 flex-1">
            {[
              { path: '/', label: 'Início', icon: 'home' },
              { path: '/tips', label: 'Dicas do Dia', icon: 'lightbulb' },
              { path: '/library', label: 'Biblioteca', icon: 'auto_awesome_motion' },
              { path: '/history', label: 'Meus Acordos', icon: 'calendar_today' },
              { path: '/new', label: 'Novo Acordo', icon: 'add_circle_outline' },
              { path: '/profile', label: 'Meu Perfil', icon: 'person_outline' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${isActive(item.path)
                  ? 'bg-primary border-black font-black neo-shadow'
                  : 'border-transparent font-bold hover:bg-gray-100 dark:hover:bg-zinc-800'
                  }`}
              >
                <span className="material-icons-outlined">{item.icon}</span>
                <span className="text-sm tracking-wider">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="pt-6 border-t-2 border-black/10 dark:border-white/10">
            <Link
              to="/login"
              className="flex items-center gap-4 p-4 rounded-2xl border-2 border-transparent font-bold hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-all text-sm tracking-wider"
            >
              <span className="material-icons-outlined">logout</span>
              Sair
            </Link>
          </div>
        </div>
      </aside>

      <header className="px-6 py-4 flex justify-between items-center sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors active:scale-90"
          >
            <span className="material-icons-outlined text-3xl text-black dark:text-white">menu</span>
          </button>
          {title && <h1 className="text-xl font-black tracking-tight text-black dark:text-white">{title}</h1>}
        </div>
        <div className="flex items-center gap-5">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <span className="material-icons-outlined text-2xl text-black dark:text-white">notifications_none</span>
          </button>
          <Link to="/profile">
            <div className="w-10 h-10 rounded-full bg-accent-yellow border-2 border-black flex items-center justify-center neo-shadow !shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:!shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] transition-transform active:scale-95">
              <span className="font-black text-black text-lg">{getInitials()}</span>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
