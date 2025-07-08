import React, { useState } from 'react';
import { Package, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ItemCard from './ItemCard';
import ItemDialog from './ItemDialog';

const ItemList = ({ items, searchTerm, categoryFilter, onUpdateItem, onDeleteItem, onAddItem }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const categories = [...new Set(items.map(item => item.category))];

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSave = (formData) => {
    if (selectedItem) {
      onUpdateItem(selectedItem.id, formData);
    } else {
      onAddItem(formData);
    }
    setSelectedItem(null);
  };

  // Helpers pour formatage
  const formatNumber = n => typeof n === 'number' ? n.toLocaleString('fr-FR') : n;
  const formatMoney = n => typeof n === 'number' ? n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : n;

  if (items.length === 0) {
    return (
      <Card className="glass-effect">
        <CardContent className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun article trouvé</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || categoryFilter !== 'all'
              ? 'Aucun article ne correspond à vos critères.'
              : 'Commencez par ajouter votre premier article.'
            }
          </p>
          {!searchTerm && categoryFilter === 'all' && (
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un Article
            </Button>
          )}
          <ItemDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} item={null} categories={categories} onSave={handleSave} />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <ItemCard key={item.id} item={item} index={index} onEdit={handleEdit} onDelete={onDeleteItem} />
        ))}
      </div>
      <ItemDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} item={selectedItem} categories={categories} onSave={handleSave} />
    </>
  );
};

export default ItemList;