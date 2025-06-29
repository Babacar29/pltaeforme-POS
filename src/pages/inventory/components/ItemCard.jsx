import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

const getStockStatus = (item) => {
  if (item.category === 'Consultations' || item.category === 'Analyses') {
    return { status: 'available', color: 'text-green-600', bg: 'bg-green-100', text: 'Disponible' };
  }
  if (item.quantity <= 0) {
    return { status: 'out', color: 'text-red-600', bg: 'bg-red-100', text: 'Rupture' };
  }
  if (item.quantity <= item.minStock) {
    return { status: 'low', color: 'text-orange-600', bg: 'bg-orange-100', text: 'Stock faible' };
  }
  return { status: 'good', color: 'text-green-600', bg: 'bg-green-100', text: `Stock: ${item.quantity}` };
};

const ItemCard = ({ item, index, onEdit, onDelete }) => {
  const stockStatus = getStockStatus(item);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="glass-effect card-hover">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg">{item.name}</CardTitle>
              <CardDescription>{item.category}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(item)}><Edit className="h-4 w-4" /></Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold gradient-text">{item.price.toFixed(2)} XOF</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
              {stockStatus.text}
            </span>
          </div>
          {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
          {(item.category !== 'Consultations' && item.category !== 'Analyses') && (
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Min: {item.minStock}</span>
              <span>Valeur: {(item.price * item.quantity).toFixed(2)} XOF</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ItemCard;