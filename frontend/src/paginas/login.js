import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login(){
    const[email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();
    const {token , login} = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() =>{
        if(token) navigate ('/produtos')
    }, [token,navigate]);

    async function handleSubmit(e){
        e.preventDefault();
        try{
            const res = await api.post('/auth/login' , {email, senha});

            console.log('resposta api de login:' ,res.data)
            if(res.data && res.data.token && res.data.user){
                login(res.data.token, res.data.user);
            }else {
                alert(res.data.error || 'Erro no login');
            }
        }catch(err){
            console.error(err);
            alert(err.response?.data?.error || 'erro ao conectar-se ao servidor');
        }
    }
    
    return(
        <div className='container'>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>

                <div className='input-group'>
                <FaEnvelope className='icon'/>
                <input
                type='email'
                placeholder='E-mail'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className='has-icon'
                />
                </div>

                <div className='input-group'>
                    <FaLock className='icon' />
                <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Senha'
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    required
                    className='has-icon'
                />
                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                </div>
                <button className='btn btn-login' type='submit'>Entrar</button>
            </form>
            <Link className='link' to="/register">Não possui conta? Cadastre-se aqui!</Link>
        </div>
    )

}
