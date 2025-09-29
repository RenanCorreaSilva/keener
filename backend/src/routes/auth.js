const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const dotenv = require('dotenv');
const auth = require('../middleware/auth');
dotenv.config();

const router = express.Router();

const SECRET = process.env.JWT_SECRET || 'uma_chave';

//rota para registro
router.post('/register', async(req,res) => {
    try{
        const {nome, email, senha} = req.body;

        if(!nome || !email || !senha) return res.status(400).json({error:'Campos Obrigatórios ausentes'})
        
        const[exists] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
            if (exists.length) return res.status(400).json({error:'Email já cadastrado'});
        
        
        const hash = await bcrypt.hash(senha,10);

        await db.query('INSERT INTO usuarios (nome,email,senha) VALUES (?,?,?)', [nome, email, hash]);

        res.json({message: 'Usuario Cadastrado com sucesso'});
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Erro interno'});
    }
});


//rota para login

router.post('/login', async(req,res) => {
    try{
        const{email , senha} = req.body;
        if(!email || !senha) return res.status(400).json({error:'Campos obrigatórios ausentes'});

        const[exists] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
            if(!exists.length) return res.status(401).json({error:'Usuario não encontrado, por favor cadastre-se'});

        const user = exists[0];  
        
        const valid = await bcrypt.compare(senha, user.senha);
            if(!valid) return res.status(401).json({error:'Senha incorreta'});

        const token = jwt.sign({id: user.id}, SECRET, {expiresIn: '8h'});

        res.json({token,user: {id:user.id, nome:user.nome, email:user.email}});

    }catch(err){
        console.log(err);
        res.status(500).json({error:'Erro interno'});
    }


    router.get('/me', auth, async(req,res) =>{
        try{
            const [rows] = await db.query('SELEC id, nome, email FROM usuarios WHERE id = ?', [req.userId]);
            if(!rows.length){
                return res.status(404).json({error:'Usuario não encontrado'});
            }
            res.json(rows[0]);
        }catch (err){
            res.status(500).json({error:'Error interno no servidor'})
        }
    })

});

module.exports = router;