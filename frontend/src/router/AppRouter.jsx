import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from '../views/ChatPage';
import LoginPage from '../views/LoginPage';
import RegisterPage from '../views/RegisterPage';

const AppRouter = () => (
    <Routes>  
        {/* Redireccion a / */}
        <Route path="*" element={<Navigate to="/auth/login" />} />

        {/* Login */}
        <Route path='/auth/login' element={<LoginPage />} />

        {/* Register */}
        <Route path='/auth/register' element={<RegisterPage />} />

        {/* Ruta inicial */}
        <Route path="/chats" element={<ChatPage />} />

    </Routes>
);

export default AppRouter