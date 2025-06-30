import React, { useState } from 'react';
import { Users, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PatientCard from './PatientCard';
import PatientDialog from './PatientDialog';
import PatientViewDialog from './PatientViewDialog';

const PatientList = ({ patients, searchTerm, onUpdatePatient, onDeletePatient, onAddPatient }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [patientToView, setPatientToView] = useState(null);

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

  const handleView = (patient) => {
    setPatientToView(patient);
    setViewDialogOpen(true);
  };

  // Fonction utilitaire pour calculer l'âge à partir de la date de naissance
  const getAge = (birthDate) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
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
      <div className="divide-y divide-gray-200 bg-white rounded-lg shadow overflow-hidden">
        {patients.map((patient, index) => (
          <div key={patient.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-base text-gray-900">
                {patient.first_name} {patient.last_name}
                {patient.birth_date && (
                  <span className="ml-2 text-xs text-muted-foreground">({getAge(patient.birth_date)} ans)</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">{patient.phone}</div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleView(patient)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleEdit(patient)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDeletePatient(patient.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <PatientDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        patient={selectedPatient}
        onSave={handleSave}
      />
      <PatientViewDialog
        isOpen={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        patient={patientToView}
      />
    </>
  );
};

export default PatientList;