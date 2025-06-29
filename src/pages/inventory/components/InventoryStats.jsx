import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

const InventoryStats = ({ inventory, lowStockItems, categories }) => {
  const totalValue = inventory.reduce((sum, item) => {
    if (item.category === 'Consultations' || item.category === 'Analyses') return sum;
    return sum + (item.price * item.quantity);
  }, 0);

  const stats = [
    { title: "Total Articles", value: inventory.length, icon: Package, color: "text-blue-600" },
    { title: "Stock Faible", value: lowStockItems.length, icon: AlertTriangle, color: "text-orange-600" },
    { title: "Catégories", value: categories.length, icon: TrendingUp, color: "text-purple-600" },
    { title: "Valeur Stock", value: `${totalValue.toFixed(0)} XOF`, icon: DollarSign, color: "text-green-600" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map(stat => (
        <Card key={stat.title} className="glass-effect">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color === 'text-blue-600' ? 'gradient-text' : stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InventoryStats;