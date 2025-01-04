import React from 'react';
import AppRouter from './router/AppRouter'
import { BrowserRouter } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full">
        <AppRouter />
      </div>
    </BrowserRouter>
  );
};

export default App
