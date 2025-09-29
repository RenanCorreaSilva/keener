const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async(req,res) => {
    try{

        const [rows] = await db.query('SELECT  * FROM produtos');
        res.json(rows);
    }catch(err){
        res.status(500).json({error:'erro interno'});
    }
});


router.post('/', auth, async(req,res) => {
    try{

        const { nome, preco, quantidade} = req.body;

        if(!nome || !preco || !quantidade) return res.status(400).json({error:'Dados obrigatórios'});
        
        await db.query('INSERT INTO produtos(nome,preco,quantidade) VALUES(?, ?, ?)',
            [nome || null, preco || 0, quantidade || 0]);

        res.json({message:'Produto cadastrado'});


    }catch(err){
        res.status(500).json({error:'erro interno'});
    }


});

module.exports = router;