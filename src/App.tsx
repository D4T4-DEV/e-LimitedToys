import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import { AppRoutes } from './Router/routes';



const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <AppRoutes /> {/* Renderiza las rutas desde un componente existente en rutas*/}
      </Layout>
    </Router>
  );
};

export default App;