import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

const periodOptions = [
	{ value: 'all', label: 'Toutes les périodes' },
	{ value: 'today', label: 'Aujourd\'hui' },
	{ value: '7days', label: '7 derniers jours' },
	{ value: '30days', label: '30 derniers jours' },
	{ value: 'custom', label: 'Personnalisé' },
];

function filterByPeriod(transactions, period) {
	if (period === 'all') return transactions;
	const now = new Date();
	let from;
	if (period === 'today') {
		from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	} else if (period === '7days') {
		from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
	} else if (period === '30days') {
		from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
	} else {
		return transactions;
	}
	return transactions.filter(t => {
		// Correction Android : parser la date au format ISO si besoin
		let txDate = new Date(t.date);
		if (isNaN(txDate.getTime()) && typeof t.date === 'string') {
			// Remplacer '-' par '/' pour compatibilité Android
			txDate = new Date(t.date.replace(/-/g, '/'));
		}
		if (isNaN(txDate.getTime())) return false;
		return txDate >= from;
	});
}

const TransactionsTable = ({ transactions }) => {
	const [search, setSearch] = useState('');
	const [period, setPeriod] = useState('all');

	const filtered = useMemo(() => {
		let data = filterByPeriod(transactions, period);
		if (search) {
			data = data.filter(t =>
				t.id.toString().includes(search) ||
				(t.patientName && t.patientName.toLowerCase().includes(search.toLowerCase())) ||
				(t.items && t.items.some(i => i.name.toLowerCase().includes(search.toLowerCase())))
			);
		}
		return data;
	}, [transactions, search, period]);

  // Helper pour formatage
  const formatMoney = n => typeof n === 'number' ? n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : n;

  const totalFiltered = filtered.reduce((sum, t) => sum + (t.total || 0), 0);

  return (
	<Card className="mt-8">
	  <CardContent className="p-4">
		<div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
		  <Input
			placeholder="Rechercher une transaction, patient ou produit..."
			value={search}
			onChange={e => setSearch(e.target.value)}
			className="md:w-64"
		  />
		  <Select value={period} onValueChange={setPeriod}>
			<SelectTrigger className="md:w-48">
			  <SelectValue placeholder="Filtrer par période" />
			</SelectTrigger>
			<SelectContent>
			  {periodOptions.map(opt => (
				<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
			  ))}
			</SelectContent>
		  </Select>
		</div>
		<div className="overflow-x-auto w-full">
          <table className="min-w-[600px] w-full text-sm">
            <colgroup>
              <col style={{ width: '5%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '65%' }} />
              <col style={{ width: '10%' }} />
            </colgroup>
            <thead>
              <tr className="bg-gray-200">
                <th className="px-2 py-2 text-left">ID</th>
                <th className="px-2 py-2 text-left">Date</th>
                <th className="px-2 py-2 text-left">Patient</th>
                <th className="px-2 py-2 text-left">Produits</th>
                <th className="px-2 py-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-muted-foreground">Aucune transaction trouvée.</td>
                </tr>
              ) : (
                filtered.map((t, idx) => (
                  <tr key={t.id} className={`border-b last:border-0 align-top text-left ${idx % 2 === 1 ? 'bg-gray-50' : ''}`}>
                    <td className="px-2 py-2 font-mono whitespace-nowrap align-middle">{t.id}</td>
                    <td className="px-2 py-2 whitespace-nowrap align-middle">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="px-2 py-2 whitespace-nowrap align-middle">{t.patientName || '-'}</td>
                    <td className="px-2 py-2 break-words max-w-[160px]">
                      {t.items && t.items.length > 0
                        ? t.items.map(i => i.name).join(' - ')
                        : '-'}
                    </td>
                    <td className="px-2 py-2 font-semibold whitespace-nowrap align-right">{t.total ? t.total.toFixed(2) + ' XOF' : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-bold">
                <td colSpan={4} className="px-2 py-2 text-right">Total</td>
                <td className="px-2 py-2 font-bold text-green-700 whitespace-nowrap align-right">{formatMoney(totalFiltered)} XOF</td>
              </tr>
            </tfoot>
          </table>
        </div>
	  </CardContent>
	</Card>
  );
};

export default TransactionsTable;
