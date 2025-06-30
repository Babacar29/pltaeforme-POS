import React from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from 'lucide-react';

const PatientSelection = ({ selectedPatient, onSelectPatient }) => {
  const { patients } = useData();

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-green-600" />
          Patient
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          value={selectedPatient ? selectedPatient.id.toString() : ''}
          onValueChange={(value) => {
            const patient = patients.find(p => p.id.toString() === value);
            onSelectPatient(patient);
          }}
        >
          <SelectTrigger className="text-black">
            <SelectValue placeholder="Sélectionner un patient">
              {selectedPatient
                ? `${selectedPatient.first_name} ${selectedPatient.last_name}`
                : null}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {patients.map((patient) => (
              <SelectItem
                key={patient.id}
                value={patient.id.toString()}
                className="text-black"
              >
                {patient.first_name} {patient.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedPatient && (
          <div className="mt-3 p-3 bg-green-50 rounded-lg">
            <p className="text-sm font-medium">
              {selectedPatient.first_name} {selectedPatient.last_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedPatient.phone}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientSelection;