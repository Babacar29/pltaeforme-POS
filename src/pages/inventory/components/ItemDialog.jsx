import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const ItemDialog = ({ isOpen, onOpenChange, item, categories, onSave }) => {
  const [formData, setFormData] = useState({
    name: '', category: '', price: '', quantity: '', minStock: '', description: ''
  });
  const { toast } = useToast();
  const isEditing = !!item;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: item.name, category: item.category, price: item.price.toString(),
        quantity: item.quantity.toString(), minStock: item.minStock.toString(),
        description: item.description || ''
      });
    } else {
      setFormData({
        name: '', category: '', price: '', quantity: '', minStock: '', description: ''
      });
    }
  }, [item, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price) {
      toast({ title: "Champs requis", description: "Veuillez remplir nom, catégorie et prix.", variant: "destructive" });
      return;
    }
    const processedData = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity) || 0,
      minStock: parseInt(formData.minStock) || 0
    };
    onSave(processedData);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier l'Article" : 'Nouvel Article'}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Modifiez les informations de l'article." : "Ajoutez un nouvel article à l'inventaire."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nom de l'article *</label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Nom de l'article" required />
            </div>
            <div>
              <label className="text-sm font-medium">Catégorie *</label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger><SelectValue placeholder="Sélectionner une catégorie" /></SelectTrigger>
                <SelectContent>
                  {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Prix (XOF) *</label>
              <Input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="0.00" required />
            </div>
            <div>
              <label className="text-sm font-medium">Quantité</label>
              <Input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} placeholder="0" />
            </div>
            <div>
              <label className="text-sm font-medium">Stock minimum</label>
              <Input type="number" value={formData.minStock} onChange={(e) => setFormData({...formData, minStock: e.target.value})} placeholder="0" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Description de l'article..."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button type="submit">{isEditing ? 'Modifier' : 'Ajouter'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDialog;