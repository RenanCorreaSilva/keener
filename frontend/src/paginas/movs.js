import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Movs(){
    const [produtoId, setProdutoID] = useState('');
    const [tipo, setTipo] = useState('entrada');
    const [quantidade, setQuantidade] = useState('');
    const [movs, setMovs] = useState([]);

    async function loadMovs() {;
        try{
            const res = await api.get('/movs');
            setMovs(res.data || []);
        }catch(err){
            console.error("erro na consulta", err);
            alert('Erro ao carregar movimentações')
        }
    }

    useEffect(()=> { loadMovs(); } , []);

    async function handleSubmit(e) {
        e.preventDefault();
        try{
            const res = await api.post('/movs', {produto_id: produtoId,tipo,quantidade});
            if (res.data && res.data.message){
                alert('Movimentação registrada')
                setProdutoID(''); setQuantidade('');
                loadMovs();
            }else{
                alert(res.data.error || 'erro no registro')
            }
        }catch(err){
            console.error(err);
            alert(err.response?.data?.error || 'Erro ao registrar movimentação');
        }
    }

    return(
        <div className="container">
            <h2>Movimentações</h2>

            <section className="product-card">
                <h3>Registrar movimentação</h3>
                
                <form className="product-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input value={produtoId} on onChange={e=> setProdutoID(e.target.value)} type="number" placeholder="ID do produto" required />
                    </div>
                    <div className="form-group">
                        <select value={tipo} onChange={e=> setTipo(e.target.value)} >
                            <option value="entrada">Entrada</option>
                            <option value="saida">Saida</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <input value={quantidade} onChange={e=> setQuantidade(e.target.value)} type="number" placeholder="Quantidade" required />
                    </div>

                    <div className="form-actions">
                        <button className="btn btn-dash"  type="submit">Registrar</button>
                    </div>
                </form>
            </section>

            <section className="product-card">
                <h3>Histórico</h3>

                <table className="product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>PRODUTO</th>
                            <th>TIPO</th>
                            <th>QTDE</th>
                            <th>DATA</th>
                        </tr>
                    </thead>

                    <tbody>
                        {movs.map(m => (
                            <tr key={m.id}>
                                <td>{m.id}</td>
                                <td>{m.produto_nome}</td>
                                <td>{m.tipo}</td>
                                <td>{m.quantidade}</td>
                                <td>{m.data}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </section>
        </div>
    )
}