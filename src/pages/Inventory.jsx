import React, { useState, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import InventoryStats from '@/pages/inventory/components/InventoryStats';
import InventoryControls from '@/pages/inventory/components/InventoryControls';
import LowStockAlert from '@/pages/inventory/components/LowStockAlert';
import ItemList from '@/pages/inventory/components/ItemList';

const Inventory = () => {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { toast } = useToast();

  const categories = useMemo(() => [...new Set(inventory.map(item => item.category))], [inventory]);

  const filteredInventory = useMemo(() =>
    inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    }),
    [inventory, searchTerm, categoryFilter]
  );

  const lowStockItems = useMemo(() =>
    inventory.filter(item =>
      item.category !== 'Consultations' && item.category !== 'Analyses' && item.quantity <= (item.minStock ?? item.min_stock)
    ),
    [inventory]
  );

  const addItem = async (formData) => {
    try {
      await addInventoryItem(formData);
      toast({ title: "Article ajouté", description: `${formData.name} a été ajouté.` });
    } catch (e) {}
  };

  const updateItem = async (itemId, formData) => {
    try {
      await updateInventoryItem(itemId, formData);
      toast({ title: "Article modifié", description: `${formData.name} a été modifié.` });
    } catch (e) {}
  };

  const deleteItem = async (itemId) => {
    try {
      await deleteInventoryItem(itemId);
      toast({ title: "Article supprimé", description: "L'article a été supprimé." });
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      <InventoryStats inventory={inventory} lowStockItems={lowStockItems} categories={categories} />
      
      <InventoryControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categories={categories}
        onAddItem={addItem}
      />
      
      {lowStockItems.length > 0 && <LowStockAlert lowStockItems={lowStockItems} onUpdateItem={updateItem}/>}
      
      <ItemList 
        items={filteredInventory} 
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        onUpdateItem={updateItem}
        onDeleteItem={deleteItem}
        onAddItem={addItem}
      />
    </div>
  );
};

export default Inventory;