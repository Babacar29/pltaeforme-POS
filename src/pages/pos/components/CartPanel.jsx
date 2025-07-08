import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, CreditCard } from 'lucide-react';
import CartItem from './CartItem';
import PatientSelection from './PatientSelection';


import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const CartPanel = ({
  cart,
  onUpdateQuantity,
  onRemoveFromCart,
  cartTotal,
  selectedPatient,
  onSelectPatient,
  onProcessSale
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirm = () => {
    setConfirmOpen(false);
    onProcessSale();
  };

  return (
    <div className="space-y-6">
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-purple-600" />
            Panier ({cart.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cart.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Panier vide</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemoveFromCart={onRemoveFromCart}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <PatientSelection
        selectedPatient={selectedPatient}
        onSelectPatient={onSelectPatient}
      />

      <Card className="glass-effect">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-2xl gradient-text">
                {cartTotal.toFixed(2)} XOF
              </span>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              size="lg"
              onClick={() => setConfirmOpen(true)}
              disabled={cart.length === 0}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Finaliser la Vente
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la vente</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-base">
            Êtes-vous sûr de vouloir finaliser cette vente ? Cette action est irréversible.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Annuler
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white" onClick={handleConfirm}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CartPanel;