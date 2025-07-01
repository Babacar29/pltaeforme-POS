import React, { useState } from 'react';
// Fonction utilitaire pour calculer l'âge à partir de la date de naissance (format YYYY-MM-DD)
function getAge(birthDate) {
  if (!birthDate) return '';
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}
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

  const handleView = (patient) => {
    setPatientToView(patient);
    setViewDialogOpen(true);
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
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Âge</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-blue-50 transition">
                <td className="px-4 py-2 font-medium">{patient.firstName} {patient.lastName}</td>
                <td className="px-4 py-2">{patient.phone}</td>
                <td className="px-4 py-2">{getAge(patient.birthDate)}</td>
                <td className="px-4 py-2">{patient.email}</td>
                <td className="px-4 py-2 flex gap-2 justify-end min-w-[120px]">
                  <Button size="icon" variant="outline" onClick={() => handleView(patient)} aria-label="Voir le patient">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" onClick={() => handleEdit(patient)} aria-label="Modifier le patient">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => onDeletePatient(patient.id)} aria-label="Supprimer le patient">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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