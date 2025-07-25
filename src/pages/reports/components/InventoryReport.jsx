import React from 'react';
//import ExportButtons from './ExportButtons';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import StatCard from './StatCard';

const InventoryReport = ({ data }) => {
  if (!data) return null;

  const { totalItems, lowStockItems, totalValue, categoryDistribution } = data;

  // Helpers pour formatage
  const formatNumber = n => typeof n === 'number' ? n.toLocaleString('fr-FR') : n;
  const formatMoney = n => typeof n === 'number' ? n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : n;

  const stats = [
    { title: "Total Articles", value: totalItems, icon: Package, color: "text-blue-600", isGradient: true },
    { title: "Stock Faible", value: lowStockItems, icon: TrendingUp, color: "text-orange-600" },
    { title: "Valeur Stock", value: `${formatMoney(totalValue)} XOF`, icon: DollarSign, color: "text-green-600" },
    { title: "Catégories", value: Object.keys(categoryDistribution).length, icon: BarChart3, color: "text-purple-600" },
  ];

  // Préparer les données pour l'export
  const exportData = {
    columns: [
      { header: 'Catégorie', accessor: 'category' },
      { header: 'Nombre d\'articles', accessor: 'count' },
      { header: 'Valeur', accessor: 'value' }
    ],
    rows: Object.entries(categoryDistribution).map(([category, stats]) => ({
      category,
      count: stats.count,
      value: stats.value
    }))
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
      </div>

      {/* <ExportButtons data={exportData} type="inventory" /> */}

      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Répartition par Catégorie</CardTitle>
          <CardDescription>Distribution de l'inventaire</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(categoryDistribution).map(([category, stats]) => (
              <div key={category} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div>
                  <p className="font-medium">{category}</p>
                  <p className="text-sm text-muted-foreground">{formatNumber(stats.count)} articles</p>
                </div>
                <span className="font-bold text-green-600">
                  {formatMoney(stats.value)} XOF
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryReport;