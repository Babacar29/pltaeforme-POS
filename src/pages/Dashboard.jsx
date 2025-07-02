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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const { sales, patients, inventory, loading } = useData();
  const [stats, setStats] = useState({
    dailySales: 0,
    totalPatients: 0,
    todayAppointments: 0,
    lowStock: 0
  });
  // Préparer les données pour le graphique des ventes (7 derniers jours)
  const [salesChartData, setSalesChartData] = useState([]);

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
    // Préparation des données pour le graphique
    const now = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      return d;
    });
    const chartData = days.map(day => {
      const dayStr = day.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: '2-digit' });
      const total = sales
        .filter(sale => {
          const saleDate = new Date(sale.date);
          return saleDate.toDateString() === day.toDateString();
        })
        .reduce((sum, sale) => sum + (sale.total || 0), 0);
      return { date: dayStr, total };
    });
    setSalesChartData(chartData);
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

  // Générer les activités récentes à partir des ventes, patients et inventaire
  const recentActivities = React.useMemo(() => {
    if (loading) return [];
    // Ventes récentes
    const salesActivities = sales.slice(0, 5).map(sale => ({
      id: `sale-${sale.id}`,
      type: 'sale',
      description: sale.patient
        ? `Vente à ${sale.patient.firstName} ${sale.patient.lastName}`
        : 'Vente (patient inconnu)',
      amount: `${(sale.total || 0).toFixed(2)} XOF`,
      timestamp: new Date(sale.date).getTime(),
      time: new Date(sale.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }));
    // Patients récents
    const patientActivities = patients.slice(-3).reverse().map(patient => ({
      id: `patient-${patient.id}`,
      type: 'patient',
      description: `Nouveau patient - ${patient.firstName} ${patient.lastName}`,
      amount: '',
      timestamp: patient.created_at ? new Date(patient.created_at).getTime() : 0,
      time: patient.created_at
        ? new Date(patient.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        : ''
    }));
    // Fusionner, trier, et ne garder que les 5 plus récentes
    return [...salesActivities, ...patientActivities]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  }, [sales, patients, loading]);

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
          <Card className="glass-effect h-[30rem]">
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
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesChartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={v => `${v.toFixed(2)} XOF`} />
                    <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
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
          <Card className="glass-effect h-[30rem]">
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
