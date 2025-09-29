const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/auth');

const router = express.Router();


//Histórico de movimentações
router.get('/', auth, async (req,res) => {
    try{
        const [rows] = await db.query(
            `SELECT m.id, m.produto_id, p.nome as produto_nome, m.usuario_id, m.tipo, m.quantidade, m.data
             FROM movimentacoes m
             JOIN produtos p ON m.produto_id = p.id
             ORDER BY m.data DESC`
        );
        res.json(rows);
    }catch(err){
        res.status(500).json({error:'Erro interno'});
    }
});

//Registro de movimentações

router.post('/', auth, async (req,res) =>{
    try{
        const { produto_id, tipo, quantidade} = req.body;

        const usuario_id = req.userId;

        if(!produto_id || !tipo || !quantidade) return res.status(400).json({error: 'Dados incompletos'});

        const conn = await db.getConnection();

        try{
            //inicio transacao
            await conn.beginTransaction();
            

            //seleciona a quantidade atual antes de realizar movimentacao
            const [pRows] = await conn.query('SELECT quantidade FROM produtos WHERE id = ? FOR UPDATE', [produto_id]);
            if(!pRows.length){
                await conn.rollback();
                conn.release();
                return res.status(404).json({error:'Produto não incontrado'});
            }
            
            //novo estoque apos movimentacao
            let current = pRows[0].quantidade;
            let newQtd = tipo === 'entrada' ? current + Number(quantidade) : current - Number(quantidade);

            if (newQtd < 0){
                await conn.rollback();
                conn.release();
                return res.status(400).json({error:'Estoque zerado'});
            }

            //atualiza estoque
            await conn.query('UPDATE produtos SET quantidade = ? WHERE id = ?', [newQtd, produto_id]);
            
            //inserir produto na tabela mov
            await conn.query('INSERT INTO movimentacoes(produto_id, usuario_id, tipo, quantidade) VALUES (?, ?, ?, ?)',
                [produto_id,usuario_id, tipo, quantidade]);

            await conn.commit();
            conn.release();

            res.json({message:'Movimentação registrada', novo_estoque:newQtd});

        }catch(err){
            await conn.rollback();
            conn.release();
            throw err;
        }
    

    }catch(err){
        console.log(err)
        res.status(500).json({error:'Erro interno'});
    }
})

module.exports = router;