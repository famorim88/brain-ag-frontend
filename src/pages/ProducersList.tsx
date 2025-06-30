import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useProducers } from '../contexts/ProducerContext';
import { Link } from 'react-router-dom';

const ListContainer = styled.div`
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden; /* Para bordas arredondadas funcionarem com overflow */
`;

const TableHeader = styled.th`
  background-color: #007bff;
  color: white;
  padding: 12px 15px;
  text-align: left;
  &:first-child {
    border-top-left-radius: 8px;
  }
  &:last-child {
    border-top-right-radius: 8px;
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
  &:hover {
    background-color: #e2e6ea;
  }
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #dee2e6;
  color: #333;
`;

const ActionsCell = styled(TableCell)`
  display: flex;
  gap: 10px;
  justify-content: flex-start;
`;

const ActionButton = styled(Link)`
  background-color: #007bff;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 0.9em;
  &:hover {
    background-color: #0056b3;
  }
`;

const DeleteButton = styled.button`
  background-color: #dc3545;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  &:hover {
    background-color: #c82333;
  }
`;

const Message = styled.p`
  text-align: center;
  margin-top: 20px;
  font-size: 1.1em;
  color: #555;
`;

const ProducersListPage: React.FC = () => {
  const { producers, loading, error, fetchProducers, deleteProducer } = useProducers();

  useEffect(() => {
    fetchProducers();
  }, [fetchProducers]);
//TAMBEM AINDA NAO TA TESTADO NO BACKEND
  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produtor?')) {
      const success = await deleteProducer(id);
      if (success) {
        alert('Produtor excluído com sucesso!');
      } else {
        alert('Erro ao excluir produtor.');
      }
    }
  };

  if (loading) {
    return <Message>Carregando produtores...</Message>;
  }

  if (error) {
    return <Message style={{ color: 'red' }}>Erro: {error}</Message>;
  }

  return (
    <ListContainer>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Lista de Produtores Rurais</h1>
      {producers.length === 0 ? (
        <Message>Nenhum produtor rural cadastrado ainda. <Link to="/producers/new">Cadastre um novo!</Link></Message>
      ) : (
        <Table>
          <thead>
            <TableRow>
              <TableHeader>Nome</TableHeader>
              <TableHeader>Fazenda</TableHeader>
              <TableHeader>CPF/CNPJ</TableHeader>
              <TableHeader>Cidade/Estado</TableHeader>
              <TableHeader>Área Total (ha)</TableHeader>
              <TableHeader>Culturas</TableHeader>
              <TableHeader>Ações</TableHeader>
            </TableRow>
          </thead>
          <tbody>
            {producers.map((producer) => (
              <TableRow key={producer.id}>
                <TableCell>{producer.name}</TableCell>
                <TableCell>{producer.farm_name}</TableCell>
                <TableCell>{producer.cpf_cnpj}</TableCell>
                <TableCell>{producer.city}/{producer.state}</TableCell>
                <TableCell>{producer.total_area.toFixed(2)}</TableCell>
                <TableCell>
                  {producer.cultures && producer.cultures.length > 0
                    ? producer.cultures.map(c => c.name).join(', ')
                    : 'Nenhuma'}
                </TableCell>
                <ActionsCell>
                  <ActionButton to={`/producers/edit/${producer.id}`}>Editar</ActionButton>
                  <DeleteButton onClick={() => handleDelete(producer.id)}>Excluir</DeleteButton>
                </ActionsCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}
    </ListContainer>
  );
};

export default ProducersListPage;