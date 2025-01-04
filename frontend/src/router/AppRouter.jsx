import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from '../views/ChatPage';

const AppRouter = () => (
    <Routes>  
        {/* Redireccion a / */}
        <Route path="*" element={<Navigate to="/" />} />

        {/* Ruta inicial */}
        <Route path="/" element={<ChatPage />} />

    </Routes>
);

export default AppRouter