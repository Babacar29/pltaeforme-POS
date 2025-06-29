import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, BarChart3, TrendingUp, Users } from 'lucide-react';
import StatCard from './StatCard';

const SalesReport = ({ data }) => {
  if (!data) return null;

  const { totalRevenue, totalTransactions, averageTransaction, newPatientsInPeriod, categoryStats, topProducts } = data;

  const stats = [
    { title: "Chiffre d'Affaires", value: `${totalRevenue.toFixed(2)} XOF`, icon: DollarSign, color: "text-green-600", isGradient: true },
    { title: "Transactions", value: totalTransactions, icon: BarChart3, color: "text-blue-600" },
    { title: "Panier Moyen", value: `${averageTransaction.toFixed(2)} XOF`, icon: TrendingUp, color: "text-purple-600" },
    { title: "Nouveaux Patients", value: newPatientsInPeriod, icon: Users, color: "text-orange-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Ventes par Catégorie</CardTitle>
            <CardDescription>Répartition du chiffre d'affaires</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(categoryStats).map(([category, stats]) => (
                <div key={category} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <div>
                    <p className="font-medium">{category}</p>
                    <p className="text-sm text-muted-foreground">{stats.quantity} articles vendus</p>
                  </div>
                  <span className="font-bold text-green-600">{stats.revenue.toFixed(2)} XOF</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Top Produits</CardTitle>
            <CardDescription>Articles les plus vendus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map(([product, stats], index) => (
                <div key={product} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{product}</p>
                      <p className="text-sm text-muted-foreground">{stats.quantity} vendus</p>
                    </div>
                  </div>
                  <span className="font-bold text-green-600">{stats.revenue.toFixed(2)} XOF</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesReport;