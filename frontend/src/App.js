import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Rota from './components/Rota';
import Login from './paginas/login';
import Register from './paginas/register';
import Produtos from './paginas/produtos';
import Movs from './paginas/movs';



export default function App() {
    const { token } = useAuth();

    return(
        <div className='app-layout'>
            {token && <Navbar />}
            <main className='main-content'>
                <Routes>
                    <Route path='/' element={<Login />}/>
                    <Route path="/register" element={<Register />} />
                    <Route path='/produtos' element={<Rota><Produtos /></Rota>} />
                    <Route path='/movs' element={<Rota><Movs /></Rota>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
}


