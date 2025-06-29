import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const ProductCard = ({ item, onAddToCart }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-200" onClick={() => onAddToCart(item)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-sm">{item.name}</h3>
            <p className="text-xs text-muted-foreground">{item.category}</p>
          </div>
          <span className="text-lg font-bold text-blue-600">
            {item.price.toFixed(2)} XOF
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className={`text-xs px-2 py-1 rounded-full ${
            item.quantity > item.minStock 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {item.category === 'Consultations' ? 'Disponible' : `Stock: ${item.quantity}`}
          </span>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default ProductCard;