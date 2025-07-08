import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import ReportControls from '@/pages/reports/components/ReportControls';
import SalesReport from '@/pages/reports/components/SalesReport';
import PatientReport from '@/pages/reports/components/PatientReport';
import InventoryReport from '@/pages/reports/components/InventoryReport';
import { getReportData } from '@/pages/reports/utils/reportUtils';
import TransactionsTable from '@/pages/reports/components/TransactionsTable';

const Reports = () => {
  const { sales, patients, inventory } = useData();
  const [dateRange, setDateRange] = useState('7days');
  const [reportType, setReportType] = useState('sales');

  const reportData = useMemo(() => 
    getReportData({ sales, patients, inventory, dateRange }),
    [sales, patients, inventory, dateRange]
  );

  const renderReport = () => {
    switch (reportType) {
      case 'patients':
        return <PatientReport data={reportData.patientStats} />;
      case 'inventory':
        return <InventoryReport data={reportData.inventoryStats} />;
      case 'sales':
      default:
        return <SalesReport data={reportData.salesStats} />;
    }
  };

  // Préparer les transactions pour le tableau (uniquement pour le rapport ventes)
  const transactions = useMemo(() => {
    if (!sales) return [];
    return sales.map(sale => ({
      id: sale.id,
      date: sale.date,
      patientName: sale.patient ? `${sale.patient.firstName} ${sale.patient.lastName}` : '',
      items: sale.items,
      total: sale.total
    }));
  }, [sales]);

  return (
    <div className="space-y-6">
      <ReportControls
        reportType={reportType}
        setReportType={setReportType}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <motion.div
        key={reportType}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderReport()}
      </motion.div>
      {reportType === 'sales' && (
        <TransactionsTable transactions={transactions} />
      )}
    </div>
  );
};

export default Reports;