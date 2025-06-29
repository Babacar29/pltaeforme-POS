import React, { useState } from 'react';
import { Users, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PatientCard from './PatientCard';
import PatientDialog from './PatientDialog';

const PatientList = ({ patients, searchTerm, onUpdatePatient, onDeletePatient, onAddPatient }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setIsDialogOpen(true);
  };

  const handleSave = (formData) => {
    if (selectedPatient) {
      onUpdatePatient(selectedPatient.id, formData);
    } else {
      onAddPatient(formData);
    }
    setSelectedPatient(null);
  };

  if (patients.length === 0) {
    return (
      <Card className="glass-effect">
        <CardContent className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun patient trouvé</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm 
              ? 'Aucun patient ne correspond à votre recherche.' 
              : 'Commencez par ajouter votre premier patient.'
            }
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un Patient
            </Button>
          )}
          <PatientDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            patient={null}
            onSave={handleSave}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {patients.map((patient, index) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            index={index}
            onEdit={handleEdit}
            onDelete={onDeletePatient}
          />
        ))}
      </div>
      <PatientDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        patient={selectedPatient}
        onSave={handleSave}
      />
    </>
  );
};

export default PatientList;