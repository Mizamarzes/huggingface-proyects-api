import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from '../views/ChatPage';
import LoginPage from '../views/LoginPage';
import RegisterPage from '../views/RegisterPage';

const AppRouter = () => (
    <Routes>  
        {/* Redireccion a / */}
        <Route path="*" element={<Navigate to="/" />} />

        {/* Login */}
        <Route path='/Login' element={<LoginPage />} />

        {/* Register */}
        <Route path='/Register' element={<RegisterPage />} />

        {/* Ruta inicial */}
        <Route path="/" element={<ChatPage />} />

    </Routes>
);

export default AppRouter