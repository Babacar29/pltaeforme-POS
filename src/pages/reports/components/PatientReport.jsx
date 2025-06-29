import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, TrendingUp, Calendar } from 'lucide-react';
import StatCard from './StatCard';

const PatientReport = ({ data }) => {
  if (!data) return null;

  const { totalPatients, newPatientsInPeriod, topPatients } = data;

  const stats = [
    { title: "Total Patients", value: totalPatients, icon: Users, color: "text-blue-600", isGradient: true },
    { title: "Nouveaux Patients", value: newPatientsInPeriod, icon: TrendingUp, color: "text-green-600" },
    { title: "Patients Actifs", value: topPatients.length, icon: Calendar, color: "text-purple-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
      </div>

      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Top Patients</CardTitle>
          <CardDescription>Patients avec le plus de visites et dépenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPatients.map(([patient, stats], index) => (
              <div key={patient} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium">{patient}</p>
                    <p className="text-sm text-muted-foreground">{stats.visits} visite{stats.visits > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <span className="font-bold text-green-600">
                  {stats.revenue.toFixed(2)} €
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientReport;