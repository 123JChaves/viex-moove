import express, { Request, Response } from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import rotasAdministrador from './rotas/RotasAdministrador';

const app = express();

app.use(cors());
app.use(express.json());

async function InicializarApp() {

    try {
        await AppDataSource.initialize();
        console.log('🛢️  Banco de dados conectado');

        app.get('/', (req:Request, res:Response) => res.json({message: 'API Online!'}))
        app.use(rotasAdministrador);

        const PORTA = 8080;

        app.listen(PORTA, '0.0.0.0', () => {
            console.log(`🌐 Servidor conectado na porta ${PORTA}: http://localhost:${PORTA}`)
        });
    } catch(erro) {
        console.error('❌Falha crítica: ', erro);
    };
};

InicializarApp();