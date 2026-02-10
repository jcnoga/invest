
import React from 'react';
import type { SimulationParams } from '../types';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { FormToggle } from './FormToggle';

interface SimulationFormProps {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
}

export const SimulationForm: React.FC<SimulationFormProps> = ({ params, setParams }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10) || 0;
    const currentYears = Math.floor(params.period / 12);
    const currentMonths = params.period % 12;

    if (name === 'periodYears') {
        setParams(prev => ({ ...prev, period: numValue * 12 + currentMonths }));
    } else if (name === 'periodMonths') {
        setParams(prev => ({ ...prev, period: currentYears * 12 + numValue }));
    }
  };


  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-200 mb-6">Parâmetros da Simulação</h2>
      <div className="space-y-6">
        <FormInput
          label="Capital Inicial"
          name="initialCapital"
          type="number"
          value={params.initialCapital}
          onChange={handleInputChange}
          prefix="R$"
          tooltip="Valor que você já tem para começar a investir."
        />
        <FormInput
          label="Aporte Periódico"
          name="periodicContribution"
          type="number"
          value={params.periodicContribution}
          onChange={handleInputChange}
          prefix="R$"
          tooltip="Valor que você planeja investir regularmente."
        />
        <FormSelect
          label="Frequência do Aporte"
          name="contributionFrequency"
          value={params.contributionFrequency}
          onChange={handleSelectChange}
          options={[
            { value: 'mensal', label: 'Mensal' },
            { value: 'trimestral', label: 'Trimestral' },
            { value: 'anual', label: 'Anual' },
          ]}
          tooltip="Com que frequência você fará os aportes."
        />
        <FormInput
          label="Taxa de Juros"
          name="interestRate"
          type="number"
          value={params.interestRate}
          onChange={handleInputChange}
          suffix="%"
          tooltip="Rentabilidade esperada do seu investimento."
        />
        <FormSelect
          label="Tipo de Taxa"
          name="rateType"
          value={params.rateType}
          onChange={handleSelectChange}
          options={[
            { value: 'mensal', label: 'Mensal' },
            { value: 'anual', label: 'Anual' },
          ]}
          tooltip="Se a taxa de juros informada é mensal ou anual."
        />
        <div className="grid grid-cols-2 gap-4">
            <FormInput
                label="Período (Anos)"
                name="periodYears"
                type="number"
                value={Math.floor(params.period / 12)}
                onChange={handlePeriodChange}
                tooltip="Duração total do investimento em anos."
            />
            <FormInput
                label="Período (Meses)"
                name="periodMonths"
                type="number"
                value={params.period % 12}
                onChange={handlePeriodChange}
                tooltip="Meses adicionais para a duração do investimento."
            />
        </div>
        <FormInput
          label="Inflação (Anual)"
          name="inflation"
          type="number"
          value={params.inflation}
          onChange={handleInputChange}
          suffix="%"
          tooltip="A inflação média esperada para o período. Usado para calcular o ganho real."
        />
        <FormInput
          label="Imposto sobre Rendimento"
          name="taxRate"
          type="number"
          value={params.taxRate}
          onChange={handleInputChange}
          suffix="%"
          tooltip="Alíquota de imposto que incidirá sobre os lucros no final."
        />
        <FormToggle
            label="Reinvestir Rendimentos"
            name="reinvest"
            checked={params.reinvest}
            onChange={handleInputChange}
            tooltip="Se os juros ganhos a cada mês serão somados ao montante para render mais juros (juros compostos)."
        />
      </div>
    </div>
  );
};
