import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Package, 
  BarChart3, 
  Settings,
  Menu,
  X,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false); // Pour mobile : sidebar élargie ou réduite
  const location = useLocation();
  const { signOut, role, user } = useAuth();

  // Correction : s'assurer que le rôle est bien pris depuis le contexte Auth (role peut être null)
  const navigation = [
    { name: 'Tableau de Bord', href: '/', icon: LayoutDashboard },
    { name: 'Point de Vente', href: '/pos', icon: ShoppingCart },
    { name: 'Patients', href: '/patients', icon: Users },
    { name: 'Inventaire', href: '/inventory', icon: Package },
    // Les liens Rapports et Paramètres sont réservés à l'admin
    ...(role === 'admin' ? [
      { name: 'Rapports', href: '/reports', icon: BarChart3 },
      { name: 'Paramètres', href: '/settings', icon: Settings },
    ] : [])
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-80 lg:block glass-effect">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold gradient-text">Koromack Sombel Diop</h1>
                <p className="text-xs text-muted-foreground">Centre de Santé</p>
              </div>
            </div>
          </div>
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-white/60 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          {/* User info */}
          <div className="p-4 border-t border-white/20">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-medium">
                  {role && role.length > 1 ? role.slice(0, 2).toUpperCase() : 'US'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Utilisateur'}</p>
                <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
              </div>
            </div>
            <Button
              className="mt-4 w-full bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600"
              onClick={signOut}
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)} />
          {/* Drawer mobile responsive */}
          <div
            className={`relative h-full bg-white glass-effect shadow-xl flex flex-col animate-slide-in-left transition-all duration-300 ${sidebarExpanded ? 'w-72 max-w-full' : 'w-16'}`}
          >
            {/* Bouton réduire/élargir */}
            <button
              className="absolute top-4 left-2 z-10 text-gray-500 hover:text-gray-900 bg-white/70 rounded-full p-1 border border-gray-200"
              onClick={() => setSidebarExpanded((v) => !v)}
              aria-label={sidebarExpanded ? 'Réduire le menu' : 'Élargir le menu'}
              style={{ transition: 'left 0.2s' }}
            >
              {sidebarExpanded ? (
                <span>&#x25C0;</span> // ◀
              ) : (
                <span>&#x25B6;</span> // ▶
              )}
            </button>
            {/* Bouton fermer */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
              onClick={() => setSidebarOpen(false)}
              aria-label="Fermer le menu"
            >
              <X className="h-6 w-6" />
            </button>
            {/* Logo */}
            <div className={`flex h-16 items-center border-b border-white/20 ${sidebarExpanded ? 'px-6' : 'justify-center px-0'}`}>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                {sidebarExpanded && (
                  <div>
                    <h1 className="text-lg font-bold gradient-text">Koromack Sombel Diop</h1>
                    <p className="text-xs text-muted-foreground">Centre de Santé</p>
                  </div>
                )}
              </div>
            </div>
            {/* Navigation */}
            <nav className={`flex-1 py-6 space-y-2 ${sidebarExpanded ? 'px-4' : 'px-0 flex flex-col items-center'}`}>
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center ${sidebarExpanded ? 'px-4 py-3' : 'justify-center py-3 w-full'} text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-white/60 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {sidebarExpanded && <span className="ml-3">{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
            {/* User info */}
            <div className={`border-t border-white/20 ${sidebarExpanded ? 'p-4' : 'p-2 flex flex-col items-center'}`}>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {role && role.length > 1 ? role.slice(0, 2).toUpperCase() : 'US'}
                  </span>
                </div>
                {sidebarExpanded && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">{role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Utilisateur'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
                  </div>
                )}
              </div>
              <Button
                className="mt-4 w-10 h-10 p-0 flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600"
                onClick={signOut}
                title="Déconnexion"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-6-3h12m0 0l-3-3m3 3l-3 3" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-x-4 glass-effect px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 bg-white/90 backdrop-blur-md w-full">
          {/* Menu hamburger mobile uniquement */}
          <div className="flex items-center lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          {/* Titre de page */}
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-center lg:justify-start">
            <div className="flex flex-1 items-center justify-center lg:justify-start">
              <h2 className="text-xl font-semibold gradient-text text-center lg:text-left">
                {navigation.find(item => item.href === location.pathname)?.name || 'Tableau de Bord'}
              </h2>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
