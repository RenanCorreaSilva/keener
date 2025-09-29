import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth} from '../context/AuthContext';


export default function Navbar(){
    const navigate = useNavigate();
    const  { user, logout } = useAuth();


    function handleLogout() {
        logout();
        navigate('/');
    }

    return(
        <nav className='navbar'>
            <div className='user-info'>
                {user ? (
                    <span className='user'>Olá, {user.nome}</span>
                ) : (
                    <span>Carregando...</span>
                )
                }
            </div>
            <NavLink to="/produtos">Produtos</NavLink>
            <NavLink to="/movs">Movimentações</NavLink>
            <button onClick={handleLogout}>SAIR</button>
        </nav>
    )
}
