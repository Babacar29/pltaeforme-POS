import React, { useState, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import PatientList from '@/pages/patients/components/PatientList';
import PatientsHeader from '@/pages/patients/components/PatientsHeader';

const Patients = () => {
  const { patients, addPatient, updatePatient, deletePatient } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredPatients = useMemo(() => 
    patients.filter(patient =>
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.phone && patient.phone.includes(searchTerm)) ||
      (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [patients, searchTerm]);

  const addPatientHandler = async (formData) => {
    try {
      // Conversion explicite en string au format YYYY-MM-DD si c'est un objet Date
      let birthDate = formData.birthDate;
      if (birthDate instanceof Date) {
        birthDate = birthDate.toISOString().split('T')[0];
      }
      if (typeof birthDate === 'string' && birthDate.length > 10) {
        // Si c'est une string ISO complète, tronquer à YYYY-MM-DD
        birthDate = birthDate.slice(0, 10);
      }
      const dataToSend = { ...formData, birthDate };
      console.log('[Patients] Données envoyées à addPatient:', dataToSend);
      console.log('[Patients] Type de birthDate:', typeof dataToSend.birthDate, dataToSend.birthDate);
      toast({ title: 'Debug', description: `Date de naissance: ${dataToSend.birthDate} (type: ${typeof dataToSend.birthDate})` });
      await addPatient(dataToSend);
      toast({
        title: "Patient ajouté",
        description: `${formData.firstName} ${formData.lastName} a été ajouté avec succès.`
      });
    } catch (e) {}
  };

  const updatePatientHandler = async (patientId, formData) => {
    try {
      await updatePatient(patientId, formData);
      toast({
        title: "Patient modifié",
        description: `${formData.firstName} ${formData.lastName} a été modifié avec succès.`
      });
    } catch (e) {}
  };

  const deletePatientHandler = async (patientId) => {
    try {
      await deletePatient(patientId);
      toast({
        title: "Patient supprimé",
        description: "Le patient a été supprimé avec succès."
      });
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      <PatientsHeader count={patients.length} onAddPatient={addPatientHandler} />

      <Card className="glass-effect">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher un patient par nom, téléphone ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <PatientList
        patients={filteredPatients}
        searchTerm={searchTerm}
        onUpdatePatient={updatePatientHandler}
        onDeletePatient={deletePatientHandler}
        onAddPatient={addPatientHandler}
      />
    </div>
  );
};

export default Patients;