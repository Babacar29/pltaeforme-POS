
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Printer, 
  Database, 
  Bell, 
  Shield,
  User,
  Building,
  Save,
  TestTube
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    // Informations du centre
    centerName: 'Poste de Santé MediPOS',
    address: '123 Rue de la Santé, 75001 Paris',
    phone: '01 23 45 67 89',
    email: 'contact@centre-sante.fr',
    
    // Paramètres d'impression
    printerName: 'EPSON TM-T20III',
    printerPort: 'USB001',
    receiptHeader: 'Poste de Santé MediPOS',
    receiptFooter: 'Merci de votre visite!',
    
    // Notifications
    lowStockAlert: true,
    emailNotifications: true,
    smsNotifications: false,
    
    // Sécurité
    requirePassword: true,
    sessionTimeout: 30,
    backupFrequency: 'daily'
  });

  const { toast } = useToast();

  const handleSave = () => {
    localStorage.setItem('pos_settings', JSON.stringify(settings));
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos paramètres ont été enregistrés avec succès."
    });
  };

  const testPrinter = () => {
    toast({
      title: "🚧 Cette fonctionnalité n'est pas encore implémentée—mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochaine demande ! 🚀"
    });
  };

  const exportData = () => {
    const data = {
      sales: JSON.parse(localStorage.getItem('pos_sales') || '[]'),
      patients: JSON.parse(localStorage.getItem('pos_patients') || '[]'),
      inventory: JSON.parse(localStorage.getItem('pos_inventory') || '[]'),
      settings: settings
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medipos-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Données exportées",
      description: "Vos données ont été exportées avec succès."
    });
  };

  const clearAllData = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes les données ? Cette action est irréversible.')) {
      localStorage.removeItem('pos_sales');
      localStorage.removeItem('pos_patients');
      localStorage.removeItem('pos_inventory');
      localStorage.removeItem('pos_settings');
      
      toast({
        title: "Données supprimées",
        description: "Toutes les données ont été supprimées.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Paramètres</h1>
        <p className="text-muted-foreground">
          Configurez votre système POS selon vos besoins
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Informations du centre */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              Informations du Poste
            </CardTitle>
            <CardDescription>
              Informations générales de votre centre de santé
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nom du centre</label>
              <Input
                value={settings.centerName}
                onChange={(e) => setSettings({...settings, centerName: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Adresse</label>
              <Input
                value={settings.address}
                onChange={(e) => setSettings({...settings, address: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Téléphone</label>
                <Input
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paramètres d'impression */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Printer className="h-5 w-5 text-green-600" />
              Configuration Imprimante
            </CardTitle>
            <CardDescription>
              Paramètres pour votre imprimante EPSON TM-T20III
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nom de l'imprimante</label>
                <Input
                  value={settings.printerName}
                  onChange={(e) => setSettings({...settings, printerName: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Port</label>
                <Input
                  value={settings.printerPort}
                  onChange={(e) => setSettings({...settings, printerPort: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">En-tête du reçu</label>
              <Input
                value={settings.receiptHeader}
                onChange={(e) => setSettings({...settings, receiptHeader: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Pied de page du reçu</label>
              <Input
                value={settings.receiptFooter}
                onChange={(e) => setSettings({...settings, receiptFooter: e.target.value})}
              />
            </div>
            <Button onClick={testPrinter} className="w-full">
              <TestTube className="mr-2 h-4 w-4" />
              Tester l'Imprimante
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configurez vos préférences de notification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Alertes stock faible</p>
                <p className="text-sm text-muted-foreground">Recevoir des alertes quand le stock est bas</p>
              </div>
              <input
                type="checkbox"
                checked={settings.lowStockAlert}
                onChange={(e) => setSettings({...settings, lowStockAlert: e.target.checked})}
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notifications email</p>
                <p className="text-sm text-muted-foreground">Recevoir des notifications par email</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notifications SMS</p>
                <p className="text-sm text-muted-foreground">Recevoir des notifications par SMS</p>
              </div>
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                className="h-4 w-4"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              Sécurité
            </CardTitle>
            <CardDescription>
              Paramètres de sécurité et d'accès
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mot de passe requis</p>
                <p className="text-sm text-muted-foreground">Exiger un mot de passe pour accéder au système</p>
              </div>
              <input
                type="checkbox"
                checked={settings.requirePassword}
                onChange={(e) => setSettings({...settings, requirePassword: e.target.checked})}
                className="h-4 w-4"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Timeout de session (minutes)</label>
              <Input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Fréquence de sauvegarde</label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => setSettings({...settings, backupFrequency: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="daily">Quotidienne</option>
                <option value="weekly">Hebdomadaire</option>
                <option value="monthly">Mensuelle</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gestion des données */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-indigo-600" />
            Gestion des Données
          </CardTitle>
          <CardDescription>
            Sauvegarde et gestion de vos données
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-purple-600">
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder les Paramètres
            </Button>
            
            <Button onClick={exportData} variant="outline">
              <Database className="mr-2 h-4 w-4" />
              Exporter les Données
            </Button>
            
            <Button onClick={clearAllData} variant="destructive">
              <Database className="mr-2 h-4 w-4" />
              Effacer Toutes les Données
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Intégration Supabase */}
      <Card className="glass-effect border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Database className="h-5 w-5" />
            Intégration Base de Données
          </CardTitle>
          <CardDescription className="text-blue-700">
            Connectez votre système à Supabase pour une sauvegarde cloud sécurisée
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-100 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Avantages de Supabase :</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Sauvegarde automatique en temps réel</li>
                <li>• Synchronisation multi-appareils</li>
                <li>• Sécurité et chiffrement des données</li>
                <li>• Accès depuis n'importe où</li>
                <li>• Rapports avancés et analytics</li>
              </ul>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Actuellement, vos données sont stockées localement. 
                Pour une solution professionnelle complète, connectez-vous à Supabase.
              </p>
              <Button className="bg-gradient-to-r from-green-500 to-blue-600">
                <Database className="mr-2 h-4 w-4" />
                Configurer Supabase
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
