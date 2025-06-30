import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import api from '../services/api';
import { DashboardSummary } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardContainer = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CardTitle = styled.h2`
  color: #333;
  margin-bottom: 10px;
  font-size: 1.2em;
`;

const CardValue = styled.p`
  color: #007bff;
  font-size: 2.5em;
  font-weight: bold;
`;

const ChartCard = styled(Card)`
  min-height: 350px; /* Garante altura mínima para os gráficos */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin-top: 20px;
`;

const LoadingMessage = styled.p`
  text-align: center;
  margin-top: 20px;
  color: #555;
`;


const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<DashboardSummary>('/dashboard/');
        setSummary(response.data);
      } catch (err: any) {
        console.error('Erro ao buscar dados do dashboard:', err);
        setError(err.response?.data?.detail || 'Falha ao carregar dados do dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingMessage>Carregando dados do dashboard...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>Erro: {error}</ErrorMessage>;
  }

  if (!summary) {
    return <ErrorMessage>Nenhum dado de dashboard disponível.</ErrorMessage>;
  }

  // Dados para o gráfico de fazendas por estado
  const farmsByStateData = {
    labels: Object.keys(summary.farms_by_state),
    datasets: [
      {
        data: Object.values(summary.farms_by_state),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#007bff', '#28a745', '#dc3545', '#fd7e14'
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#007bff', '#28a745', '#dc3545', '#fd7e14'
        ],
      },
    ],
  };

  // Dados para o gráfico de culturas
  const culturesSummaryData = {
    labels: Object.keys(summary.cultures_summary),
    datasets: [
      {
        data: Object.values(summary.cultures_summary),
        backgroundColor: [
          '#ADD8E6', '#90EE90', '#FFD700', '#DA70D6', '#FFA07A', '#20B2AA', '#87CEEB', '#DDA0DD', '#F0E68C', '#B0E0E6'
        ],
        hoverBackgroundColor: [
          '#ADD8E6', '#90EE90', '#FFD700', '#DA70D6', '#FFA07A', '#20B2AA', '#87CEEB', '#DDA0DD', '#F0E68C', '#B0E0E6'
        ],
      },
    ],
  };

  const areaBySoilUseData = {
    labels: ['Área Agricultável', 'Área de Vegetação'],
    datasets: [
      {
        data: [summary.area_by_soil_use.agricultural, summary.area_by_soil_use.vegetation],
        backgroundColor: ['#28a745', '#6c757d'],
        hoverBackgroundColor: ['#28a745', '#6c757d'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat('pt-BR', { style: 'decimal' }).format(context.parsed);
            }
            return label;
          }
        }
      }
    }
  };

  return (
    <>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Dashboard</h1>
      <DashboardContainer>
        <Card>
          <CardTitle>Total de Fazendas Cadastradas</CardTitle>
          <CardValue>{summary.total_farms}</CardValue>
        </Card>
        <Card>
          <CardTitle>Total de Hectares Registrados</CardTitle>
          <CardValue>{new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(summary.total_hectares)} ha</CardValue>
        </Card>

        <ChartCard>
          <CardTitle>Fazendas por Estado</CardTitle>
          <div style={{ width: '100%', height: '300px' }}> 
            {Object.keys(summary.farms_by_state).length > 0 ? (
              <Pie data={farmsByStateData} options={chartOptions} />
            ) : (
              <p>Nenhuma fazenda cadastrada por estado.</p>
            )}
          </div>
        </ChartCard>

        <ChartCard>
          <CardTitle>Culturas Plantadas</CardTitle>
          <div style={{ width: '100%', height: '300px' }}> 
            {Object.keys(summary.cultures_summary).length > 0 ? (
              <Pie data={culturesSummaryData} options={chartOptions} />
            ) : (
              <p>Nenhuma cultura cadastrada.</p>
            )}
          </div>
        </ChartCard>

        <ChartCard>
          <CardTitle>Uso do Solo (Hectares)</CardTitle>
          <div style={{ width: '100%', height: '300px' }}>
            {summary.area_by_soil_use.agricultural > 0 || summary.area_by_soil_use.vegetation > 0 ? (
              <Pie data={areaBySoilUseData} options={chartOptions} />
            ) : (
              <p>Nenhum dado de uso do solo disponível.</p>
            )}
          </div>
        </ChartCard>
      </DashboardContainer>
    </>
  );
};

export default DashboardPage;