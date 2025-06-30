import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Calendar, MapPin } from 'lucide-react';

const PatientViewDialog = ({ isOpen, onOpenChange, patient }) => {
  if (!patient) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Détails du Patient</DialogTitle>
          <DialogDescription>
            Fiche complète du patient
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <div className="text-lg font-bold">{patient.first_name} {patient.last_name}</div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-blue-600" />
            <span>{patient.phone}</span>
          </div>
          {patient.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-green-600" />
              <span>{patient.email}</span>
            </div>
          )}
          {patient.address && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-purple-600" />
              <span>{patient.address}</span>
            </div>
          )}
          {patient.birth_date && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-orange-600" />
              <span>Date de naissance : {patient.birth_date}</span>
            </div>
          )}
          {patient.notes && (
            <div className="mt-2 p-2 bg-yellow-50 rounded-lg">
              <span className="text-xs text-yellow-800"><strong>Notes:</strong> {patient.notes}</span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PatientViewDialog;
