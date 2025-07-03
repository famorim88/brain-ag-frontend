import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import api from '../services/api';
import { Producer, ProducerCreate, ProducerUpdate, CultureCreate } from '../types';

interface ProducerContextType {
  producers: Producer[];
  loading: boolean;
  error: string | null;
  fetchProducers: () => Promise<void>;
  getProducerById: (id: number) => Producer | undefined;
  createProducer: (producer: ProducerCreate) => Promise<Producer | null>;
  updateProducer: (id: number, producer: ProducerUpdate) => Promise<Producer | null>;
  deleteProducer: (id: number) => Promise<boolean>;
  addCultureToProducer: (producerId: number, culture: CultureCreate) => Promise<CultureCreate | undefined>;
  deleteCultureFromProducer: (producerId: number, cultureId: number) => Promise<boolean>; // NEW FUNCTION
}

const ProducerContext = createContext<ProducerContextType | undefined>(undefined);

export const ProducerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Producer[]>('/producers/');
      setProducers(response.data);
    } catch (err: any) {
      console.error('Erro ao buscar produtores:', err);
      setError(err.response?.data?.detail || 'Falha ao carregar produtores.');
    } finally {
      setLoading(false);
    }
  }, []);

  const getProducerById = useCallback((id: number) => {
    return producers.find(p => p.id === id);
  }, [producers]);

  const createProducer = useCallback(async (producer: ProducerCreate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<Producer>('/producers/', producer);
      setProducers(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      console.error('Erro ao criar produtor:', err);
      setError(err.response?.data?.detail || 'Falha ao cadastrar produtor.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProducer = useCallback(async (id: number, producer: ProducerUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put<Producer>(`/producers/${id}`, producer);
      setProducers(prev => prev.map(p => (p.id === id ? response.data : p)));
      return response.data;
    } catch (err: any) {
      console.error('Erro ao atualizar produtor:', err);
      setError(err.response?.data?.detail || 'Falha ao atualizar produtor.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProducer = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/producers/${id}`);
      setProducers(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err: any) {
      console.error('Erro ao deletar produtor:', err);
      setError(err.response?.data?.detail || 'Falha ao deletar produtor.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

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

  const deleteCultureFromProducer = useCallback(async (producerId: number, cultureId: number) => {
    setLoading(true);
    setError(null);
    console.log('delete')
    try {
      await api.delete(`/producers/${producerId}/cultures/${cultureId}`);
      // Remove a cultura do estado local após a deleção bem-sucedida
      setProducers(prevProducers => prevProducers.map(p => {
        if (p.id === producerId) {
          return {
            ...p,
            cultures: p.cultures.filter(c => c.id !== cultureId) // Filtra a cultura deletada
          };
        }
        return p;
      }));
      return true;
    } catch (err: any) {
      console.error('Erro ao deletar cultura:', err);
      setError(err.response?.data?.detail || 'Falha ao deletar cultura.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const contextValue = {
    producers,
    loading,
    error,
    fetchProducers,
    getProducerById,
    createProducer,
    updateProducer,
    deleteProducer,
    addCultureToProducer,
    deleteCultureFromProducer,
  };

  return (
    <ProducerContext.Provider value={contextValue}>
      {children}
    </ProducerContext.Provider>
  );
};

export const useProducers = () => {
  const context = useContext(ProducerContext);
  if (!context) {
    throw new Error('useProducers must be used within a ProducerProvider');
  }
  return context;
};