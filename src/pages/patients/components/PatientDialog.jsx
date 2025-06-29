import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const PatientDialog = ({ isOpen, onOpenChange, patient, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    address: '', birthDate: '', notes: ''
  });
  const { toast } = useToast();
  const isEditing = !!patient;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        firstName: patient.firstName || '',
        lastName: patient.lastName || '',
        phone: patient.phone || '',
        email: patient.email || '',
        address: patient.address || '',
        birthDate: patient.birthDate || '',
        notes: patient.notes || ''
      });
    } else {
      setFormData({
        firstName: '', lastName: '', phone: '', email: '',
        address: '', birthDate: '', notes: ''
      });
    }
  }, [patient, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir au minimum le nom, prénom et téléphone.",
        variant: "destructive"
      });
      return;
    }
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifier le Patient' : 'Nouveau Patient'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modifiez les informations du patient.' : 'Ajoutez un nouveau patient au système.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Prénom *</label>
              <Input value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} placeholder="Prénom" required />
            </div>
            <div>
              <label className="text-sm font-medium">Nom *</label>
              <Input value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} placeholder="Nom" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Téléphone *</label>
              <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="06 12 34 56 78" required />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="email@exemple.com" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Adresse</label>
            <Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Adresse complète" />
          </div>
          <div>
            <label className="text-sm font-medium">Date de naissance</label>
            <Input type="date" value={formData.birthDate} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-medium">Notes médicales</label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Allergies, conditions médicales, notes importantes..."
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

export default PatientDialog;