import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { Administrador } from '../entidades/Administrador';
import RequisicaoInvalida from '../erro/RequisicaoInvalida';
import NaoEncontrado from '../erro/NaoEncontrado';
import IAdministrador from '../interfaces/IAdministrador';
import validarCamposObrigatorios from '../utilitarios/validadores/validarCamposObrigatorios';
import TextoHelper from '../utilitarios/helpers/TextoHelper';
import CpfValido from '../utilitarios/validadores/validacaoDeCpf';
import VerificarDuplicidade from '../utilitarios/helpers/VerificarDuplicidade';

class ServicosAdministrador {
    
    private static repositorioAdministrador = AppDataSource.getRepository(Administrador);

    static async listarAdministradores(): Promise<Administrador[]> {
        return await this.repositorioAdministrador.find({
            select: {
                id: true,
                nome: true,
                cpf: true,
                email: true,
                numeroWhatsApp: true,
                whatsAppLid: true,
                dataDeRegistro: true,
                dataDeEdicao: true

            },
        });
    }

    static async mostrarUmAdministrador(id: number): Promise<Administrador> {
        const administrador = await this.repositorioAdministrador.findOne({
            where: { id },
            select: {
                id: true,
                nome: true,
                cpf: true,
                email: true,
                numeroWhatsApp: true,
                whatsAppLid: true,
                dataDeRegistro: true,
                dataDeEdicao: true

            },
        });

        if(!administrador) {
            throw new NaoEncontrado('Administrador não encontrado!');
        };

        return administrador;
    };

    // Service para buscar administrador por @lid:
    static async buscarAdministradorPorLid(whatsAppLid: string): Promise<IAdministrador | null> {
        const jidLimpo = whatsAppLid.replace(/:[0-9]+/, '');
        return await this.repositorioAdministrador.findOne({ 
            where: {whatsAppLid: jidLimpo} 
        });
    };

    static async cadastrarAdministrador(dados: IAdministrador): Promise<Administrador> {

        validarCamposObrigatorios<Administrador>(dados as Administrador, 
            ['nome', 'cpf', 'email', 'senha', 'numeroWhatsApp']
        );

        if(dados.nome) {
            dados.nome = TextoHelper.sanitizarNome(dados.nome);
        };

        if(!CpfValido(dados.cpf)) {
            throw new RequisicaoInvalida('CPF Inválido!');
        };

        await VerificarDuplicidade<IAdministrador>({
            repositorio: this.repositorioAdministrador,
            dados: { cpf: dados.cpf, email: dados.email, numeroWhatsApp: dados.numeroWhatsApp }
        });

        const novoAdministrador = await this.repositorioAdministrador.save(
            this.repositorioAdministrador.create(dados)
        );

        const {senha, ...resultado} = novoAdministrador;

        return resultado as Administrador;
    };

    static async editarAdministrador(id: number, dados: Partial<IAdministrador>): Promise<Administrador>{

        const administradorEditado = await this.repositorioAdministrador.findOne({ where: {id} });

        if(!administradorEditado) {
            throw new NaoEncontrado('Administrador não encontrado para a edição')
        }

        if(dados.nome) {
            dados.nome = TextoHelper.sanitizarNome(dados.nome)
        };

        if(dados.cpf && !CpfValido(dados.cpf)) {
            throw new RequisicaoInvalida('O novo CPF é inválido')
        };

        if(dados.cpf || dados.email || dados.numeroWhatsApp) {
            await VerificarDuplicidade<IAdministrador>({
                repositorio: this.repositorioAdministrador,
                dados: {
                    cpf: dados.cpf ?? administradorEditado.cpf,
                    email: dados.email ?? administradorEditado.email,
                    numeroWhatsApp: dados.numeroWhatsApp ?? administradorEditado.numeroWhatsApp
                },
                idParaIgnorar: id,
            });
        };

        this.repositorioAdministrador.merge(administradorEditado, dados as Administrador);
        const administradorAtualizado = await this.repositorioAdministrador.save(administradorEditado);

        const {senha, ...resultado} = administradorAtualizado;
        return resultado as Administrador;
    };

    static async deletarAdministrador(id: number): Promise<void> {
        
        const administradorDeletado = await this.repositorioAdministrador.findOne({ where: { id }});

        if(!administradorDeletado) {
            throw new NaoEncontrado('Administrador não encontrado para a exclusão!')
        };

        await this.repositorioAdministrador.remove(administradorDeletado);
    };

    static async logarAdministrador(dados: Partial<IAdministrador>): Promise<{
        token: string;
        administrador: Omit<IAdministrador, 'senha'> & { dataRegistro: Date; dataEdicao: Date }
    }> {

        validarCamposObrigatorios<Partial<IAdministrador>>(dados, ['email', 'senha']);

        const administrador = await this.repositorioAdministrador.createQueryBuilder('administrador')
            .where('administrador.email = :email', {email: dados.email})
            .addSelect('administrador.senha')
            .getOne();
        
        if(!administrador) {
            throw new RequisicaoInvalida('Email ou Senha inválidos!')
        };

        const senhaValida = await bcrypt.compare(dados.senha!, administrador.senha)

        if(!senhaValida) {
            throw new RequisicaoInvalida('Email ou Senha inválidos!')
        };

        const senhaSecreta = process.env.JWT_ADMIN_SECRET;

        if(!senhaSecreta) {
            console.error('ERRO CRÍTICO: JWT_ADMIN_SECRET não configurado no .env!')
            throw new Error('Erro interno no servidor de autenticação!')
        };

        const token = jwt.sign(
            {
                id: administrador.id,
                email: administrador.email,
                role: 'administrador'
            },
            senhaSecreta,
            { expiresIn: '8h'}
        );
                return { 
            token, 
            administrador: {
                id: administrador.id,
                nome: administrador.nome,
                cpf: administrador.cpf,
                numeroWhatsApp: administrador.numeroWhatsApp,
                whatsAppLid: administrador.whatsAppLid,
                email: administrador.email,
                dataRegistro: administrador.dataDeRegistro,
                dataEdicao: administrador.dataDeEdicao
            }
        };
    };
};

export default ServicosAdministrador;