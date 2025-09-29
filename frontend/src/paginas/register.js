import React, { useState }  from "react";
import {Link, useNavigate} from 'react-router-dom';
import api from '../services/api';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';


export default function Register() {

  const[nome, setNome] = useState('');
  const[email, setEmail] = useState('');
  const[senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();
    try{
      const res = await api.post('/auth/register' , {nome, email, senha});
      if(res.data && res.data.message){
        alert('Cadastro realizado com sucesso. Faça login.');
        navigate('/');
      }else{
        alert(res.data.error || 'erro no cadastro');
      }
    }catch(err){
      console.log(err);
      alert(err.response?.data?.error || 'Erro ao conectar ao servidor');
    }
  }

  return(
    <div className="container">
      <h2>Faça seu cadastro</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <FaUser className="icon" />
          <input className="has-icon"
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Nome"
          required
          />
        </div>

        <div className="input-group">
          <FaEnvelope className="icon" />
          <input className="has-icon" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>

         <div className="input-group">
            <FaLock className="icon" />
            <input className="has-icon"
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                value={senha}
                onChange={e=> setSenha(e.target.value)}
                required
            />
            <span className="toggle-password" onClick={()=> setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash />: <FaEye />}</span>
          </div>
          <button className="btn btn-registro" type='submit'>Cadastrar</button>
      </form>
        <Link className="link" to='/login'>Ja possui cadastro? Faça seu login.</Link>
    </div>
  )

}

