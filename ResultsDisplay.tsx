
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { SimulationResult } from '../types';
import { toBRL } from '../services/financeService';
import { Download, TrendingUp, PiggyBank, Landmark, ShieldCheck, MinusCircle } from 'lucide-react';

interface ResultsDisplayProps {
  results: SimulationResult;
}

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; color: string }> = ({ icon, title, value, color }) => (
  <div className="bg-gray-800 p-4 rounded-lg flex items-start gap-4">
    <div className={`p-2 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-xl font-bold text-gray-200">{value}</p>
    </div>
  </div>
);

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const { monthlyData, totalInvested, totalInterest, finalGrossValue, finalNetValue, taxAmount } = results;

  const exportToCSV = () => {
    const headers = "Mês,Data,Total Investido,Juros do Mês,Total de Juros,Saldo Bruto";
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers + "\n"
      + monthlyData.map(d => `${d.month},${d.date},${d.totalInvested.toFixed(2)},${d.interest.toFixed(2)},${d.totalInterest.toFixed(2)},${d.balance.toFixed(2)}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "simulacao_juros_compostos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={<PiggyBank size={24} className="text-white"/>} title="Total Investido" value={toBRL(totalInvested)} color="bg-blue-500" />
        <StatCard icon={<TrendingUp size={24} className="text-white"/>} title="Total em Juros" value={toBRL(totalInterest)} color="bg-brand-primary" />
        <StatCard icon={<MinusCircle size={24} className="text-white"/>} title="Imposto Estimado" value={toBRL(taxAmount)} color="bg-red-500" />
        <StatCard icon={<Landmark size={24} className="text-white"/>} title="Valor Final Bruto" value={toBRL(finalGrossValue)} color="bg-purple-500" />
        <StatCard icon={<ShieldCheck size={24} className="text-white"/>} title="Valor Final Líquido" value={toBRL(finalNetValue)} color="bg-teal-500" />
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Evolução do Patrimônio</h3>
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3A" />
                    <XAxis dataKey="date" stroke="#888888" fontSize={12} />
                    <YAxis stroke="#888888" fontSize={12} tickFormatter={(value) => toBRL(Number(value))} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #3A3A3A' }}
                        labelStyle={{ color: '#EAEAEA' }}
                        formatter={(value: number) => [toBRL(value), '']}
                    />
                    <Legend wrapperStyle={{ color: '#EAEAEA' }} />
                    <Line type="monotone" dataKey="totalInvested" name="Total Investido" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="balance" name="Valor Bruto" stroke="#00A86B" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Projeção Detalhada</h3>
            <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors text-sm"
            >
                <Download size={16} />
                Exportar CSV
            </button>
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-700 sticky top-0">
              <tr>
                <th className="p-3">Data</th>
                <th className="p-3">Investido</th>
                <th className="p-3">Juros</th>
                <th className="p-3">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((data) => (
                <tr key={data.month} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="p-3">{data.date}</td>
                  <td className="p-3">{toBRL(data.totalInvested)}</td>
                  <td className="p-3 text-brand-primary">{toBRL(data.interest)}</td>
                  <td className="p-3 font-semibold">{toBRL(data.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
