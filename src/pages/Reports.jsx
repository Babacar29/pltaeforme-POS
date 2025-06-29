import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import ReportControls from '@/pages/reports/components/ReportControls';
import SalesReport from '@/pages/reports/components/SalesReport';
import PatientReport from '@/pages/reports/components/PatientReport';
import InventoryReport from '@/pages/reports/components/InventoryReport';
import { getReportData } from '@/pages/reports/utils/reportUtils';

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
    </div>
  );
};

export default Reports;