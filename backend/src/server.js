


const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();


const authRoutes = require('./routes/auth');
const produtoRoutes = require('./routes/produtos');
const movsRoutes = require('./routes/movs');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/produtos', produtoRoutes);
app.use('/movs', movsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`) );



