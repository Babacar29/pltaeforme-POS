import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemoveFromCart }) => {
  useEffect(() => {
    console.log('[CartItem] Rendered:', item);
  }, [item]);

  return (
    <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium text-sm">{item.name}</h4>
        <p className="text-xs text-muted-foreground">
          {item.price.toFixed(2)} XOF × {item.quantity}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            console.log('[CartItem] Minus clicked', item.id, item.quantity - 1);
            onUpdateQuantity(item.id, item.quantity - 1);
          }}
        >
          <Minus className="h-3 w-3" />
        </Button>
        
        <span className="w-8 text-center text-sm font-medium">
          {item.quantity}
        </span>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            console.log('[CartItem] Plus clicked', item.id, item.quantity + 1);
            onUpdateQuantity(item.id, item.quantity + 1);
          }}
        >
          <Plus className="h-3 w-3" />
        </Button>
        
        <Button
          size="sm"
          variant="destructive"
          onClick={() => {
            console.log('[CartItem] Remove clicked', item.id);
            onRemoveFromCart(item.id);
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;