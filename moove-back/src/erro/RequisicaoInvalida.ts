import ApiErro from "./ApiErro";

class RequisicaoInvalida extends ApiErro {
    constructor(mensagem = 'Dados inválidos!') {
        super(mensagem, 400)
    };
};

export default RequisicaoInvalida;