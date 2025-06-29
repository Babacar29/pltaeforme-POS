import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import PatientDialog from './PatientDialog';

const PatientsHeader = ({ count, onAddPatient }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = (formData) => {
    onAddPatient(formData);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Gestion des Patients</h1>
          <p className="text-muted-foreground">
            {count} patient{count !== 1 ? 's' : ''} enregistré{count !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Patient
        </Button>
      </div>
      <PatientDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        patient={null}
        onSave={handleSave}
      />
    </>
  );
};

export default PatientsHeader;