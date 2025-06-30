// frontend/src/contexts/ProducerContext.tsx
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import api from '../services/api';
import { Producer, ProducerCreate, ProducerUpdate, CultureCreate } from '../types';

// Definir a interface para o contexto (o que ele vai expor)
interface ProducerContextType {
  producers: Producer[];
  loading: boolean;
  error: string | null;
  fetchProducers: () => Promise<void>;
  createProducer: (producer: ProducerCreate) => Promise<Producer | undefined>;
  getProducerById: (id: number) => Producer | undefined;
  updateProducer: (id: number, updates: ProducerUpdate) => Promise<Producer | undefined>;
  deleteProducer: (id: number) => Promise<boolean>;
  addCultureToProducer: (producerId: number, culture: CultureCreate) => Promise<CultureCreate | undefined>;
}

// Criar o contexto
const ProducerContext = createContext<ProducerContextType | undefined>(undefined);

// Hook personalizado para usar o contexto facilmente
export const useProducers = () => {
  const context = useContext(ProducerContext);
  if (context === undefined) {
    throw new Error('useProducers must be used within a ProducerProvider');
  }
  return context;
};

// Componente Provider que vai envolver sua aplicação
interface ProducerProviderProps {
  children: ReactNode;
}

export const ProducerProvider: React.FC<ProducerProviderProps> = ({ children }) => {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar todos os produtores
  const fetchProducers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Producer[]>('/producers/');
      setProducers(response.data);
    } catch (err: any) {
      console.error('Erro ao buscar produtores:', err);
      setError(err.response?.data?.detail || 'Falha ao buscar produtores.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para criar um novo produtor
  const createProducer = useCallback(async (producer: ProducerCreate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<Producer>('/producers/', producer);
      setProducers(prev => [...prev, response.data]); // Adiciona o novo produtor à lista local
      return response.data;
    } catch (err: any) {
      console.error('Erro ao criar produtor:', err);
      setError(err.response?.data?.detail || 'Falha ao criar produtor.');
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para obter um produtor por ID (do estado local)
  const getProducerById = useCallback((id: number) => {
    return producers.find(p => p.id === id);
  }, [producers]);


  // Função para atualizar um produtor
  const updateProducer = useCallback(async (id: number, updates: ProducerUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put<Producer>(`/producers/${id}`, updates);
      setProducers(prev => prev.map(p => (p.id === id ? response.data : p))); // Atualiza na lista local
      return response.data;
    } catch (err: any) {
      console.error('Erro ao atualizar produtor:', err);
      setError(err.response?.data?.detail || 'Falha ao atualizar produtor.');
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para deletar um produtor
  const deleteProducer = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/producers/${id}`);
      setProducers(prev => prev.filter(p => p.id !== id)); // Remove da lista local
      return true;
    } catch (err: any) {
      console.error('Erro ao deletar produtor:', err);
      setError(err.response?.data?.detail || 'Falha ao deletar produtor.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para adicionar cultura a um produtor
  const addCultureToProducer = useCallback(async (producerId: number, culture: CultureCreate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<CultureCreate>(`/producers/${producerId}/cultures/`, culture);
      // Opcional: Recarregar o produtor ou atualizar a lista de culturas do produtor localmente
      // Para manter a lista `producers` atualizada, talvez seja melhor chamar fetchProducers() novamente
      // ou atualizar o produtor específico se a API retornar o produtor com a cultura adicionada.
      // Por simplicidade, vamos só retornar a cultura criada aqui.
      return response.data;
    } catch (err: any) {
      console.error('Erro ao adicionar cultura:', err);
      setError(err.response?.data?.detail || 'Falha ao adicionar cultura.');
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);


  const contextValue = {
    producers,
    loading,
    error,
    fetchProducers,
    createProducer,
    getProducerById,
    updateProducer,
    deleteProducer,
    addCultureToProducer,
  };

  return (
    <ProducerContext.Provider value={contextValue}>
      {children}
    </ProducerContext.Provider>
  );
};