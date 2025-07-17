/* import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportButtons = ({ data, type }) => {
  // data: array of objects, type: 'inventory' | 'sales' | ...
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data.rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Export');
    XLSX.writeFile(wb, `${type}_report.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`${type.charAt(0).toUpperCase() + type.slice(1)} Report`, 14, 16);
    doc.autoTable({
      head: [data.columns.map(col => col.header)],
      body: data.rows.map(row => data.columns.map(col => row[col.accessor])),
      startY: 22,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [22, 160, 133] }
    });
    doc.save(`${type}_report.pdf`);
  };

  return (
    <div className="flex gap-2 mb-4">
      <Button variant="outline" onClick={handleExportExcel} size="sm">
        <FileSpreadsheet className="h-4 w-4 mr-2" /> Exporter Excel
      </Button>
      <Button variant="outline" onClick={handleExportPDF} size="sm">
        <FileDown className="h-4 w-4 mr-2" /> Exporter PDF
      </Button>
    </div>
  );
};

export default ExportButtons; */
