const getDateRangeFilter = (dateRange) => {
  const now = new Date();
  const ranges = {
    '1day': new Date(now.getTime() - 24 * 60 * 60 * 1000),
    '7days': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    '30days': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    '90days': new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
    'all': new Date(0)
  };
  return ranges[dateRange] || ranges['all'];
};

const getSalesStats = (filteredSales, filteredPatients) => {
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = filteredSales.length;
  const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
  
  const categoryStats = {};
  filteredSales.forEach(sale => {
    sale.items.forEach(item => {
      if (!categoryStats[item.category]) categoryStats[item.category] = { revenue: 0, quantity: 0 };
      categoryStats[item.category].revenue += item.price * item.quantity;
      categoryStats[item.category].quantity += item.quantity;
    });
  });

  const productStats = {};
  filteredSales.forEach(sale => {
    sale.items.forEach(item => {
      if (!productStats[item.name]) productStats[item.name] = { revenue: 0, quantity: 0, price: item.price };
      productStats[item.name].revenue += item.price * item.quantity;
      productStats[item.name].quantity += item.quantity;
    });
  });
  const topProducts = Object.entries(productStats).sort(([,a], [,b]) => b.revenue - a.revenue).slice(0, 5);

  return { totalRevenue, totalTransactions, averageTransaction, categoryStats, topProducts, newPatientsInPeriod: filteredPatients.length };
};

const getPatientStats = (patients, filteredSales) => {
  const patientVisits = {};
  filteredSales.forEach(sale => {
    if (sale.patient) {
      const patientKey = `${sale.patient.firstName} ${sale.patient.lastName}`;
      if (!patientVisits[patientKey]) patientVisits[patientKey] = { visits: 0, revenue: 0 };
      patientVisits[patientKey].visits += 1;
      patientVisits[patientKey].revenue += sale.total;
    }
  });
  const topPatients = Object.entries(patientVisits).sort(([,a], [,b]) => b.revenue - a.revenue).slice(0, 5);

  return { totalPatients: patients.length, topPatients };
};

const getInventoryStats = (inventory) => {
  const lowStockItems = inventory.filter(item => 
    item.quantity <= item.minStock && item.category !== 'Consultations' && item.category !== 'Analyses'
  ).length;
  
  const totalValue = inventory.reduce((sum, item) => {
    if (item.category === 'Consultations' || item.category === 'Analyses') return sum;
    return sum + (item.price * item.quantity);
  }, 0);
  
  const categoryDistribution = {};
  inventory.forEach(item => {
    if (!categoryDistribution[item.category]) categoryDistribution[item.category] = { count: 0, value: 0 };
    categoryDistribution[item.category].count += 1;
    categoryDistribution[item.category].value += item.price * (item.quantity === 999 ? 0 : item.quantity);
  });

  return { totalItems: inventory.length, lowStockItems, totalValue, categoryDistribution };
};

export const getReportData = ({ sales, patients, inventory, dateRange }) => {
  const dateFilter = getDateRangeFilter(dateRange);
  const filteredSales = sales.filter(sale => new Date(sale.date) >= dateFilter);
  const filteredPatients = patients.filter(patient => new Date(patient.createdAt) >= dateFilter);

  const salesStats = getSalesStats(filteredSales, filteredPatients);
  const patientStats = getPatientStats(patients, filteredSales);
  patientStats.newPatientsInPeriod = filteredPatients.length; // Add this stat
  const inventoryStats = getInventoryStats(inventory);

  return { salesStats, patientStats, inventoryStats };
};