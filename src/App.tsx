import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';

import DashboardPage from './pages/DashBoard';
import ProducersListPage from './pages/ProducersList';
import ProducerFormPage from './pages/ProducerFormPage';

// Estilos básicos com styled-components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f0f2f5;
`;

const Header = styled.header`
  background-color: #282c34;
  padding: 20px;
  color: white;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Nav = styled.nav`
  margin-top: 10px;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  margin: 0 15px;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 20px auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
`;

function App() {
  return (
    <Router>
      <Container>
        <Header>
          <h1>BRAIN AG - Painel Administrativo</h1>
          <Nav>
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/producers">Produtores</NavLink>
            <NavLink to="/producers/new">Novo Produtor</NavLink>
          </Nav>
        </Header>
        <MainContent>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/producers" element={<ProducersListPage />} />
            <Route path="/producers/new" element={<ProducerFormPage />} />
            <Route path="/producers/edit/:id" element={<ProducerFormPage />} /> {/* Rota para edição */}
            {/* Adicione outras rotas conforme necessário */}
          </Routes>
        </MainContent>
      </Container>
    </Router>
  );
}

export default App;