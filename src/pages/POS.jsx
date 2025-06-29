import React, { useState, useMemo } from 'react';
import { useToast } from '@/components/ui/use-toast';
import InventoryBrowser from '@/pages/pos/components/InventoryBrowser';
import CartPanel from '@/pages/pos/components/CartPanel';
import ReceiptDialog from '@/pages/pos/components/ReceiptDialog';
import { useData } from '@/contexts/DataContext';

const POS = () => {
  const { inventory, sales, addSale } = useData();
  const [cart, setCart] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  const { toast } = useToast();

  const addToCart = (item) => {
    if (item.quantity <= 0 && item.category !== 'Consultations') {
      toast({
        title: "Stock insuffisant",
        description: `${item.name} n'est plus en stock.`,
        variant: "destructive"
      });
      return;
    }
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.id !== id));
      return;
    }
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Remplace la fonction getCartTotal par un useMemo pour garantir la réactivité
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const processSale = async () => {
    if (cart.length === 0) {
      toast({
        title: "Panier vide",
        description: "Ajoutez des articles avant de finaliser la vente.",
        variant: "destructive"
      });
      return;
    }
    try {
      const sale = {
        patient: selectedPatient,
        items: cart,
        total: cartTotal,
        paymentMethod: 'cash'
      };
      const savedSale = await addSale(sale);
      setLastSale({ ...sale, ...savedSale });
      setShowReceipt(true);
      setCart([]);
      setSelectedPatient(null);
      toast({
        title: "Vente finalisée",
        description: `Vente de ${sale.total.toFixed(2)} XOF enregistrée avec succès.`
      });
    } catch (e) {
      console.error('[POS] Erreur lors de la finalisation de la vente:', e);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la vente. Détail: " + (e?.message || e),
        variant: "destructive"
      });
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <InventoryBrowser inventory={inventory} onAddToCart={addToCart} />
      <CartPanel
        cart={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemoveFromCart={removeFromCart}
        cartTotal={cartTotal}
        selectedPatient={selectedPatient}
        onSelectPatient={setSelectedPatient}
        onProcessSale={processSale}
      />
      <ReceiptDialog
        isOpen={showReceipt}
        onOpenChange={setShowReceipt}
        lastSale={lastSale}
      />
    </div>
  );
};

export default POS;