import react from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export default function Rota({ children }) {
    const {token} = useAuth();
    if(!token) return<Navigate to="/" replace/>
    return children;
}