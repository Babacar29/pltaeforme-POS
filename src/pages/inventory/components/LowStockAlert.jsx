import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Edit } from 'lucide-react';
import ItemDialog from './ItemDialog';

const LowStockAlert = ({ lowStockItems, onUpdateItem }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSave = (formData) => {
    onUpdateItem(selectedItem.id, formData);
    setSelectedItem(null);
  };

  const categories = [...new Set(lowStockItems.map(item => item.category))];

  return (
    <>
      <Card className="glass-effect border-orange-200 bg-orange-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <AlertTriangle className="h-5 w-5" />
            Alertes Stock Faible
          </CardTitle>
          <CardDescription className="text-orange-700">
            {lowStockItems.length} article{lowStockItems.length > 1 ? 's' : ''} nécessite{lowStockItems.length > 1 ? 'nt' : ''} un réapprovisionnement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {lowStockItems.map(item => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Stock: {item.quantity}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <ItemDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={selectedItem}
        categories={categories}
        onSave={handleSave}
      />
    </>
  );
};

export default LowStockAlert;