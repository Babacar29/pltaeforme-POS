export const defaultInventory = [
  { id: 1, name: 'Consultation Générale', price: 45.00, category: 'Consultations', quantity: 999, minStock: 0, description: 'Consultation médicale standard' },
  { id: 2, name: 'Consultation Spécialisée', price: 65.00, category: 'Consultations', quantity: 999, minStock: 0, description: 'Consultation avec spécialiste' },
  { id: 3, name: 'Paracétamol 500mg', price: 3.50, category: 'Médicaments', quantity: 150, minStock: 20, description: 'Antalgique et antipyrétique' },
  { id: 4, name: 'Ibuprofène 400mg', price: 4.20, category: 'Médicaments', quantity: 120, minStock: 15, description: 'Anti-inflammatoire non stéroïdien' },
  { id: 5, name: 'Amoxicilline 500mg', price: 8.90, category: 'Médicaments', quantity: 80, minStock: 10, description: 'Antibiotique pénicilline' },
  { id: 6, name: 'Pansements', price: 2.30, category: 'Matériel', quantity: 200, minStock: 30, description: 'Pansements adhésifs stériles' },
  { id: 7, name: 'Seringues (x10)', price: 5.50, category: 'Matériel', quantity: 100, minStock: 20, description: 'Seringues jetables 5ml' },
  { id: 8, name: 'Thermomètre', price: 12.00, category: 'Matériel', quantity: 25, minStock: 5, description: 'Thermomètre digital' },
  { id: 9, name: 'Analyse Sanguine', price: 25.00, category: 'Analyses', quantity: 999, minStock: 0, description: 'Analyse sanguine complète' },
  { id: 10, name: 'Test Urinaire', price: 15.00, category: 'Analyses', quantity: 999, minStock: 0, description: 'Analyse d\'urine standard' }
];

export const defaultPatients = [
  {
    id: 1,
    firstName: 'Marie',
    lastName: 'Dubois',
    phone: '06 12 34 56 78',
    email: 'marie.dubois@email.com',
    address: '123 Rue de la Santé, 75001 Paris',
    birthDate: '1985-03-15',
    notes: 'Allergie aux pénicillines',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    firstName: 'Jean',
    lastName: 'Martin',
    phone: '06 98 76 54 32',
    email: 'jean.martin@email.com',
    address: '456 Avenue du Bien-être, 69000 Lyon',
    birthDate: '1978-11-22',
    notes: 'Diabète type 2',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    firstName: 'Sophie',
    lastName: 'Bernard',
    phone: '06 55 44 33 22',
    email: 'sophie.bernard@email.com',
    address: '789 Boulevard de la Paix, 13000 Marseille',
    birthDate: '1992-07-08',
    notes: 'Suivi grossesse',
    createdAt: new Date().toISOString()
  }
];