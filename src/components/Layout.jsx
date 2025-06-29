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
  const location = useLocation();
  const { signOut } = useAuth();

  const navigation = [
    { name: 'Tableau de Bord', href: '/', icon: LayoutDashboard },
    { name: 'Point de Vente', href: '/pos', icon: ShoppingCart },
    { name: 'Patients', href: '/patients', icon: Users },
    { name: 'Inventaire', href: '/inventory', icon: Package },
    { name: 'Rapports', href: '/reports', icon: BarChart3 },
    { name: 'Paramètres', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-80 glass-effect">
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
                <span className="text-white font-medium">AD</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Administrateur</p>
                <p className="text-xs text-muted-foreground">admin@centre-sante.com</p>
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

      {/* Main content */}
      <div className="pl-80">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-x-4 glass-effect px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 bg-white/90 backdrop-blur-md w-full">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h2 className="text-xl font-semibold gradient-text">
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
