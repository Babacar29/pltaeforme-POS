import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Phone, Mail, Calendar, MapPin } from 'lucide-react';

const calculateAge = (birthDate) => {
  if (!birthDate) return '';
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const PatientCard = ({ patient, index, onEdit, onDelete }) => (
  <motion.div
    key={patient.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
  >
    <Card className="glass-effect card-hover">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {patient.first_name} {patient.last_name}
            </CardTitle>
            {patient.birthDate && (
              <CardDescription>
                {calculateAge(patient.birthDate)} ans
              </CardDescription>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(patient)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(patient.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-blue-600" />
          <span>{patient.phone}</span>
        </div>
        
        {patient.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-green-600" />
            <span className="truncate">{patient.email}</span>
          </div>
        )}
        
        {patient.address && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground text-xs leading-relaxed">
              {patient.address}
            </span>
          </div>
        )}
        
        {patient.notes && (
          <div className="mt-3 p-2 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Notes:</strong> {patient.notes}
            </p>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
          <Calendar className="h-3 w-3" />
          <span>
            Ajouté le {new Date(patient.createdAt).toLocaleDateString('fr-FR')}
          </span>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default PatientCard;