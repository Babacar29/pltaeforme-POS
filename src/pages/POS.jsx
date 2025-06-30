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
  const [loadingReceipt, setLoadingReceipt] = useState(false); // Ajout du loader
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
    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    console.log('[POS] Calcul du total', { cart, total });
    return total;
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
    if (!selectedPatient) {
      toast({
        title: "Patient obligatoire",
        description: "Veuillez sélectionner un patient avant de finaliser la vente.",
        variant: "destructive"
      });
      return;
    }
    try {
      setLoadingReceipt(true); // Démarre le loader
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
    } finally {
      setLoadingReceipt(false); // Arrête le loader
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3 relative">
      {loadingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="text-lg font-semibold text-blue-700">Préparation du reçu...</span>
          </div>
        </div>
      )}
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