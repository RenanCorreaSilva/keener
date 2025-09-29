import React, { useEffect, useState} from "react";
import api from '../services/api';

export default function Produtos(){
    const[produto, setProduto] = useState([]);
    const [nome, setNome]= useState('');
    const [preco, setPreco]= useState('');
    const [quantidade, setQuantidade]= useState('');
    
    async function loadProdutos(){
    try{
        const res = await api.get('/produtos');
        setProduto(res.data || []);
    }catch(err){
        alert('erro ao carregar produtos')
    }
    }

    useEffect(()=> {loadProdutos(); }, []);
    

    async function handleSubmit(e){
        e.preventDefault();

        try{
            const res = await api.post('/produtos', {nome, preco: preco ||0,quantidade : quantidade || 0});
            if (res.data && res.data.message){
                alert('produto cadastro');
                setNome(''); setPreco(''); setQuantidade('');
                loadProdutos();
            }else{
                alert(res.data.error || 'erro no cadastro');
            }
        }catch(err){
            console.error(err);
            alert(err.response?.data?.error || 'Erro ao cadastrar produto')
        }

    }

    return(
        <div className="container">
            <h2>Produtos</h2>
            <section className="product-card">
                <h3>Cadastrar Produto</h3>

                <form className="product-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input value={nome} onChange={e=> setNome(e.target.value)} placeholder="Nome" required/>
                    </div>

                    <div className="form-group">
                        <input value={preco} onChange={e=> setPreco(e.target.value)} type="number" step='0.01' placeholder="Preço" required />
                    </div>

                    <div className="form-group">
                        <input className="form-group" onChange={e=> setQuantidade(e.target.value)} type="number" placeholder="Quantidade" required/>
                    </div>

                    <div className="form-actions">
                        <button className="btn btn-dash" type="submit">Salvar</button>
                    </div>
                </form>
            </section>

            <section className="product-card">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NOME</th>
                            <th>QTDE</th>
                            <th>PREÇO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produto.map(p=> (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.nome}</td>
                                <td>{p.quantidade}</td>
                                <td>{p.preco}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    )

}



