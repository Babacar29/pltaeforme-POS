import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Calendar,
  Activity,
  Package,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { sales, patients, inventory, loading } = useData();
  const [stats, setStats] = useState({
    dailySales: 0,
    totalPatients: 0,
    todayAppointments: 0,
    lowStock: 0
  });

  useEffect(() => {
    if (loading) return;
    const today = new Date().toDateString();
    const todaySales = sales.filter(sale =>
      new Date(sale.date).toDateString() === today
    );
    const dailyTotal = todaySales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const lowStockItems = inventory.filter(item => item.quantity <= (item.min_stock ?? item.minStock)).length;
    setStats({
      dailySales: dailyTotal,
      totalPatients: patients.length,
      todayAppointments: Math.floor(Math.random() * 15) + 5, // Simulation
      lowStock: lowStockItems
    });
  }, [sales, patients, inventory, loading]);

  const statCards = [
    {
      title: "Ventes du Jour",
      value: `${stats.dailySales.toFixed(2)} XOF`,
      description: "Total des ventes aujourd'hui",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
      change: "+12.5%"
    },
    {
      title: "Patients Enregistrés",
      value: stats.totalPatients.toString(),
      description: "Total des patients",
      icon: Users,
      color: "from-blue-500 to-cyan-600",
      change: "+3.2%"
    },
    {
      title: "RDV Aujourd'hui",
      value: stats.todayAppointments.toString(),
      description: "Rendez-vous programmés",
      icon: Calendar,
      color: "from-purple-500 to-violet-600",
      change: "+8.1%"
    },
    {
      title: "Stock Faible",
      value: stats.lowStock.toString(),
      description: "Articles en rupture",
      icon: AlertCircle,
      color: "from-red-500 to-rose-600",
      change: "-2.4%"
    }
  ];

  const recentActivities = [
    { id: 1, type: 'sale', description: 'Vente - Consultation générale', amount: '45.00 XOF', time: '10:30' },
    { id: 2, type: 'patient', description: 'Nouveau patient - Marie Dubois', amount: '', time: '10:15' },
    { id: 3, type: 'inventory', description: 'Stock mis à jour - Paracétamol', amount: '', time: '09:45' },
    { id: 4, type: 'sale', description: 'Vente - Médicaments', amount: '28.50 XOF', time: '09:30' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="glass-effect card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600 font-medium">{stat.change}</span> depuis hier
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Graphique des ventes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Évolution des Ventes
              </CardTitle>
              <CardDescription>
                Ventes des 7 derniers jours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">Graphique des ventes</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Intégration graphique disponible avec Supabase
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activités récentes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                Activités Récentes
              </CardTitle>
              <CardDescription>
                Dernières actions effectuées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'sale' ? 'bg-green-100 text-green-600' :
                        activity.type === 'patient' ? 'bg-blue-100 text-blue-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {activity.type === 'sale' ? <ShoppingCart className="h-4 w-4" /> :
                         activity.type === 'patient' ? <Users className="h-4 w-4" /> :
                         <Package className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                    {activity.amount && (
                      <span className="text-sm font-semibold text-green-600">
                        {activity.amount}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Actions rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>
              Accès rapide aux fonctionnalités principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <button
                className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/pos')}
              >
                <ShoppingCart className="h-8 w-8 mb-3" />
                <h3 className="font-semibold mb-2">Nouvelle Vente</h3>
                <p className="text-sm opacity-90">Démarrer une transaction</p>
              </button>
              
              <button
                className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/patients')}
              >
                <Users className="h-8 w-8 mb-3" />
                <h3 className="font-semibold mb-2">Nouveau Patient</h3>
                <p className="text-sm opacity-90">Enregistrer un patient</p>
              </button>
              
              <button
                className="p-6 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/inventory')}
              >
                <Package className="h-8 w-8 mb-3" />
                <h3 className="font-semibold mb-2">Gérer Stock</h3>
                <p className="text-sm opacity-90">Mettre à jour l'inventaire</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
