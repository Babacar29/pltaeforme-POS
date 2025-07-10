import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [inventory, setInventoryState] = useState([]);
  const [patients, setPatientsState] = useState([]);
  const [sales, setSalesState] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setInventoryState(data || []);
    } catch (error) {
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger l'inventaire",
        variant: "destructive"
      });
    }
  };

  const loadPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('firstName');
      
      if (error) throw error;
      setPatientsState(data || []);
    } catch (error) {
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les patients",
        variant: "destructive"
      });
    }
  };

  const loadSales = async () => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          patients (
            id,
            firstName,
            lastName,
            phone
          ),
          sale_items (
            id,
            item_name,
            item_price,
            quantity,
            item_category
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedSales = data?.map(sale => ({
        id: sale.id,
        date: sale.created_at,
        total: parseFloat(sale.total),
        paymentMethod: sale.payment_method,
        patient: sale.patients ? {
          id: sale.patients.id,
          firstName: sale.patients.firstName,
          lastName: sale.patients.lastName,
          phone: sale.patients.phone
        } : null,
        items: sale.sale_items?.map(item => ({
          id: item.id,
          name: item.item_name,
          price: parseFloat(item.item_price),
          quantity: item.quantity,
          category: item.item_category
        })) || []
      })) || [];
      
      setSalesState(formattedSales);
    } catch (error) {
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les ventes",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadInventory(), loadPatients(), loadSales()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const setInventory = async (newInventory) => {
    if (typeof newInventory === 'function') {
      const updatedInventory = newInventory(inventory);
      setInventoryState(updatedInventory);
    } else {
      setInventoryState(newInventory);
    }
  };

  const setPatients = async (newPatients) => {
    if (typeof newPatients === 'function') {
      const updatedPatients = newPatients(patients);
      setPatientsState(updatedPatients);
    } else {
      setPatientsState(newPatients);
    }
  };

  const setSales = async (newSales) => {
    if (typeof newSales === 'function') {
      const updatedSales = newSales(sales);
      setSalesState(updatedSales);
    } else {
      setSalesState(newSales);
    }
  };

  const addInventoryItem = async (item) => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .insert([{
          name: item.name,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
          min_stock: item.minStock,
          description: item.description
        }])
        .select()
        .single();

      if (error) throw error;
      
      const formattedItem = {
        id: data.id,
        name: data.name,
        category: data.category,
        price: parseFloat(data.price),
        quantity: data.quantity,
        minStock: data.min_stock,
        description: data.description
      };
      
      setInventoryState(prev => [...prev, formattedItem]);
      return formattedItem;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'article",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateInventoryItem = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .update({
          name: updates.name,
          category: updates.category,
          price: updates.price,
          quantity: updates.quantity,
          min_stock: updates.minStock,
          description: updates.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const formattedItem = {
        id: data.id,
        name: data.name,
        category: data.category,
        price: parseFloat(data.price),
        quantity: data.quantity,
        minStock: data.min_stock,
        description: data.description
      };
      
      setInventoryState(prev => prev.map(item => item.id === id ? formattedItem : item));
      return formattedItem;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'article",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteInventoryItem = async (id) => {
    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setInventoryState(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'article",
        variant: "destructive"
      });
      throw error;
    }
  };

  const addPatient = async (patient) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert([{
          firstName: patient.firstName,
          lastName: patient.lastName,
          phone: patient.phone,
          email: patient.email,
          address: patient.address,
          birthDate: patient.birthDate,
          notes: patient.notes
        }])
        .select()
        .single();

      if (error) throw error;
      
      const formattedPatient = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        birthDate: data.birthDate,
        notes: data.notes,
        createdAt: data.createdAt
      };
      
      setPatientsState(prev => [...prev, formattedPatient]);
      return formattedPatient;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le patient",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updatePatient = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .update({
          firstName: updates.firstName,
          lastName: updates.lastName,
          phone: updates.phone,
          email: updates.email,
          address: updates.address,
          birthDate: updates.birthDate,
          notes: updates.notes,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      const formattedPatient = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        birthDate: data.birthDate,
        notes: data.notes,
        createdAt: data.createdAt
      };
      setPatientsState(prev => prev.map(p => p.id === id ? formattedPatient : p));
      return formattedPatient;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le patient",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deletePatient = async (id) => {
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPatientsState(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le patient",
        variant: "destructive"
      });
      throw error;
    }
  };

  const addSale = async (sale) => {
    try {
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert([{
          patient_id: sale.patient?.id || null,
          total: sale.total,
          payment_method: sale.paymentMethod || 'cash'
        }])
        .select()
        .single();

      if (saleError) throw saleError;

      const saleItems = sale.items.map(item => ({
        sale_id: saleData.id,
        inventory_id: item.id,
        item_name: item.name,
        item_price: item.price,
        quantity: item.quantity,
        item_category: item.category 
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems);

      if (itemsError) throw itemsError;

      for (const item of sale.items) {
        if (item.category !== 'Consultations' && item.category !== 'Analyses') {
          // Récupérer la quantité actuelle
          const { data: currentItem, error: fetchError } = await supabase
            .from('inventory')
            .select('quantity')
            .eq('id', item.id)
            .single();
          if (fetchError) throw fetchError;
          const newQuantity = (currentItem?.quantity || 0) - item.quantity;
          const { error: updateError } = await supabase
            .from('inventory')
            .update({ quantity: newQuantity })
            .eq('id', item.id);
          if (updateError) throw updateError;
        }
      }

      await Promise.all([loadSales(), loadInventory()]);
      
      return saleData;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la vente",
        variant: "destructive"
      });
      throw error;
    }
  };

  const value = {
    inventory,
    patients,
    sales,
    loading,
    setInventory,
    setPatients,
    setSales,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    addPatient,
    updatePatient,
    deletePatient,
    addSale,
    refreshData: async () => {
      await Promise.all([loadInventory(), loadPatients(), loadSales()]);
    }
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};