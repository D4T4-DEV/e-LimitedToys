import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ProductCatalog from './pages/ProductCatalog';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/catalog" element={<ProductCatalog />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
