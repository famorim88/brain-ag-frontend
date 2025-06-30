import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducers } from '../contexts/ProducerContext';
import { ProducerCreate, ProducerUpdate, CultureCreate } from '../types';

const FormContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #f9f9f9;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1em;
  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: bold;
  transition: background-color 0.2s ease-in-out;
  &:hover {
    background-color: #0056b3;
  }
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  margin-top: 5px;
  font-size: 0.9em;
`;

const CultureSection = styled.div`
  border: 1px dashed #ccc;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
`;

const CultureItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

const RemoveCultureButton = styled.button`
  background-color: #ffc107; /* Cor de aviso */
  color: #333;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8em;
  &:hover {
    background-color: #e0a800;
  }
`;

// Helper para validar CPF/CNPJ (um placeholder simples)
const validateCpfCnpj = (value: string): boolean => {
    // A validação completa deve ser feita no backend.
    // Aqui, apenas uma validação de formato básica.
    const cleanValue = value.replace(/\D/g, ''); // Remove não dígitos
    return cleanValue.length === 11 || cleanValue.length === 14;
};

const ProducerFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); // 'id' pode ser undefined para novo cadastro
  const navigate = useNavigate();
  const { producers, loading, error, createProducer, updateProducer, getProducerById, addCultureToProducer } = useProducers();

  const isEditMode = !!id; // True se houver um ID na URL

  const [formData, setFormData] = useState<ProducerCreate | ProducerUpdate>({
    cpf_cnpj: '',
    name: '',
    farm_name: '',
    city: '',
    state: '',
    total_area: 0,
    agricultural_area: 0,
    vegetation_area: 0,
    cultures: [], // Para armazenar culturas para um novo produtor
  });

  const [cultureForm, setCultureForm] = useState<CultureCreate>({ crop_year: '', name: '' });
  const [formError, setFormError] = useState<string | null>(null);
  const [cpfCnpjError, setCpfCnpjError] = useState<string | null>(null);
  const [areaError, setAreaError] = useState<string | null>(null);

  // Efeito para carregar dados do produtor em modo de edição
  useEffect(() => {
    if (isEditMode && id) {
      const producerIdNum = parseInt(id);
      const producerToEdit = getProducerById(producerIdNum);
      if (producerToEdit) {
        setFormData({
          cpf_cnpj: producerToEdit.cpf_cnpj,
          name: producerToEdit.name,
          farm_name: producerToEdit.farm_name,
          city: producerToEdit.city,
          state: producerToEdit.state,
          total_area: producerToEdit.total_area,
          agricultural_area: producerToEdit.agricultural_area,
          vegetation_area: producerToEdit.vegetation_area,
          cultures: producerToEdit.cultures.map(c => ({ crop_year: c.crop_year, name: c.name })), // Mapeia para CultureCreate
        });
      } else if (!loading && !error) { // Se não encontrou e já carregou
          // Navegar de volta ou mostrar erro, produtor não encontrado no estado local
          // Poderia buscar diretamente da API se a Context API não tiver todos os produtores
          console.warn(`Produtor com ID ${id} não encontrado no estado local.`);
          // Exemplo: navigate('/producers'); // Redirecionar
      }
    }
  }, [isEditMode, id, getProducerById, loading, error]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value, // Garante que números sejam números
    }));
    // Limpar erro de CPF/CNPJ ou área ao digitar novamente
    if (name === 'cpf_cnpj') setCpfCnpjError(null);
    if (name === 'total_area' || name === 'agricultural_area' || name === 'vegetation_area') setAreaError(null);
  };

  const handleCultureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCultureForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCulture = () => {
    if (cultureForm.crop_year && cultureForm.name) {
        // Se estiver em modo de edição e o produtor já existir, adiciona via API
        if (isEditMode && id) {
            const producerIdNum = parseInt(id);
            addCultureToProducer(producerIdNum, cultureForm)
                .then(addedCulture => {
                    if (addedCulture) {
                        alert('Cultura adicionada com sucesso!');
                        // Atualizar a lista local de culturas (o ideal seria recarregar o produtor completo)
                        setFormData(prev => ({
                            ...prev,
                            cultures: [...(prev.cultures || []), addedCulture] // Adiciona a cultura ao array local
                        }));
                        setCultureForm({ crop_year: '', name: '' });
                    }
                });
        } else {
            // Para novo produtor, adiciona à lista local do formulário
            setFormData(prev => ({
                ...prev,
                cultures: [...(prev.cultures || []), cultureForm]
            }));
            setCultureForm({ crop_year: '', name: '' });
        }
    } else {
      alert('Por favor, preencha o ano da safra e o nome da cultura.');
    }
  };

  const handleRemoveCulture = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      cultures: (prev.cultures || []).filter((_, index) => index !== indexToRemove)
    }));
  };

  const validateForm = () => {
    let isValid = true;
    setFormError(null);
    setCpfCnpjError(null);
    setAreaError(null);

    // Validação de campos obrigatórios simples
    if (!formData.name || !formData.farm_name || !formData.city || !formData.state) {
      setFormError('Todos os campos obrigatórios devem ser preenchidos.');
      isValid = false;
    }

    // Validação de CPF/CNPJ (frontend, validação completa no backend)
    if (!isEditMode && (!formData.cpf_cnpj || !validateCpfCnpj(formData.cpf_cnpj))) {
        setCpfCnpjError('CPF/CNPJ inválido ou não preenchido.');
        isValid = false;
    }

    // Validação de áreas
    if (formData.total_area <= 0) {
        setAreaError('A área total da fazenda deve ser maior que zero.');
        isValid = false;
    } else if (formData.agricultural_area + formData.vegetation_area > formData.total_area) {
        setAreaError('A soma das áreas agricultável e de vegetação não pode exceder a área total da fazenda.');
        isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    // Criar um objeto com os dados que serão enviados ao backend
    const dataToSend = {
      ...formData,
      total_area: parseFloat(formData.total_area as any), // Garantir que são números
      agricultural_area: parseFloat(formData.agricultural_area as any),
      vegetation_area: parseFloat(formData.vegetation_area as any),
    };


    if (isEditMode && id) {
      // Modo de edição
      const producerIdNum = parseInt(id);
      const updatedProducer = await updateProducer(producerIdNum, dataToSend);
      if (updatedProducer) {
        alert('Produtor atualizado com sucesso!');
        navigate(`/producers/${producerIdNum}`); // Navega para a página de detalhes ou lista
      }
    } else {
      // Modo de criação
      const createdProducer = await createProducer(dataToSend as ProducerCreate);
      if (createdProducer) {
        alert('Produtor cadastrado com sucesso!');
        navigate('/producers'); // Navega para a lista de produtores
      }
    }
  };

  return (
    <FormContainer>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        {isEditMode ? `Editar Produtor: ${formData.name}` : 'Cadastrar Novo Produtor Rural'}
      </h1>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Nome do Produtor</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
          <Input
            type="text"
            id="cpf_cnpj"
            name="cpf_cnpj"
            value={formData.cpf_cnpj || ''}
            onChange={handleChange}
            readOnly={isEditMode} // CPF/CNPJ não deve ser editável após cadastro
            required={!isEditMode} // Obrigatório apenas no cadastro
          />
          {cpfCnpjError && <ErrorMessage>{cpfCnpjError}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="farm_name">Nome da Fazenda</Label>
          <Input
            type="text"
            id="farm_name"
            name="farm_name"
            value={formData.farm_name || ''}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="city">Cidade</Label>
          <Input
            type="text"
            id="city"
            name="city"
            value={formData.city || ''}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="state">Estado</Label>
          <Input
            type="text"
            id="state"
            name="state"
            value={formData.state || ''}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="total_area">Área Total (hectares)</Label>
          <Input
            type="number"
            id="total_area"
            name="total_area"
            value={formData.total_area || ''}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="agricultural_area">Área Agricultável (hectares)</Label>
          <Input
            type="number"
            id="agricultural_area"
            name="agricultural_area"
            value={formData.agricultural_area || ''}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="vegetation_area">Área de Vegetação (hectares)</Label>
          <Input
            type="number"
            id="vegetation_area"
            name="vegetation_area"
            value={formData.vegetation_area || ''}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
          {areaError && <ErrorMessage>{areaError}</ErrorMessage>}
        </FormGroup>

        {/* Seção para adicionar e listar culturas */}
        <CultureSection>
          <CardTitle style={{ marginTop: '0', fontSize: '1.1em' }}>Culturas</CardTitle>
          <FormGroup>
            <Label htmlFor="culture_crop_year">Ano da Safra</Label>
            <Input
              type="text"
              id="culture_crop_year"
              name="crop_year"
              value={cultureForm.crop_year}
              onChange={handleCultureChange}
              placeholder="Ex: Safra 2023"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="culture_name">Nome da Cultura</Label>
            <Input
              type="text"
              id="culture_name"
              name="name"
              value={cultureForm.name}
              onChange={handleCultureChange}
              placeholder="Ex: Soja, Milho"
            />
          </FormGroup>
          <Button type="button" onClick={handleAddCulture} style={{ marginTop: '10px' }}>
            Adicionar Cultura
          </Button>

          {formData.cultures && formData.cultures.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3>Culturas Adicionadas:</h3>
              {formData.cultures.map((culture, index) => (
                <CultureItem key={index}>
                  <span>{culture.crop_year} - {culture.name}</span>
                  <RemoveCultureButton type="button" onClick={() => handleRemoveCulture(index)}>Remover</RemoveCultureButton>
                </CultureItem>
              ))}
            </div>
          )}
        </CultureSection>

        {formError && <ErrorMessage>{formError}</ErrorMessage>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Processando...' : (isEditMode ? 'Atualizar Produtor' : 'Cadastrar Produtor')}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ProducerFormPage;