import { Router } from "express";
import ControladorAdministrador from "../controladores/ControladorAdministrador";

const rotasAdministrador = Router();

rotasAdministrador.get('administradores', 
    ControladorAdministrador.listarAdministradores
);

rotasAdministrador.get('administrador/:id', 
    ControladorAdministrador.mostrarUmAdministrador
);

rotasAdministrador.post('administrador', 
    ControladorAdministrador.cadastrarAdministrador
);

rotasAdministrador.post('administrador/login', 
    ControladorAdministrador.logarAdministrador
);

rotasAdministrador.put('administrador/:id', 
    ControladorAdministrador.editarAdministrador
);

rotasAdministrador.delete('administrador/:id', 
    ControladorAdministrador.deletarAdministrador
);

export default rotasAdministrador;