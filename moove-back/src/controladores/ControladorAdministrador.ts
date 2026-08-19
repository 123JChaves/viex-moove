import { Request, Response } from "express";
import ServicosAdministrador from "../servicos/ServicosAdministrador";

class ControladorAdministrador {

    static async logarAdministrador(req: Request, res: Response) {
        const administradorLogar = await ServicosAdministrador.logarAdministrador(req.body);
        return res.status(200).json({
            message: 'Login realizado com sucesso!',
            ...administradorLogar
        });
    };

    static async listarAdministradores(req: Request, res: Response) {
        const administradores = await ServicosAdministrador.listarAdministradores();
        return res.status(200).json(administradores);
    };

    static async mostrarUmAdministrador(req: Request, res: Response) {
        const { id } = req.body;
        const administrador = await ServicosAdministrador.mostrarUmAdministrador(Number(id));
        return res.status(200).json(administrador);
    };

    static async cadastrarAdministrador(req: Request, res: Response) {
        const novoAdministrador = await ServicosAdministrador.cadastrarAdministrador(req.body);
        return res.status(201).json({
            message: 'Administrador cadastrado com sucesso!',
            novoAdministrador
        });
    };

    static async editarAdministrador(req: Request, res: Response) {
        const { id } = req.params;
        const administradorEditado = await ServicosAdministrador.editarAdministrador(Number(id), req.body);
        return res.status(200).json({
            message: 'Administrador atualizado com sucesso!',
            administradorAtualizado: administradorEditado
        });
    };

    static async deletarAdministrador(req: Request, res: Response) {
        const { id } = req.params;
        await ServicosAdministrador.deletarAdministrador(Number(id));
        return res.status(200).json({
            message: 'Administrador excluído com sucesso'
        });
    };
};

export default ControladorAdministrador;