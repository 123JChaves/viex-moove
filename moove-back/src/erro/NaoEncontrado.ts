import ApiErro from "./ApiErro";

class NaoEncontrado extends ApiErro {
    constructor(mensagem = 'Recurso não encontrado!') {
        super(mensagem, 404)
    };
};

export default NaoEncontrado;