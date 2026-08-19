import RequisicaoInvalidada from "../../erro/RequisicaoInvalida";

const validarCamposObrigatorios = <T>(dados: T, campos: (keyof T)[]) => {

    const camposVazios = campos.filter(campo => {
        const valor = dados[campo];
        return valor === undefined || valor === null || 
        (typeof valor === 'string' && valor.trim() === "" )
    });

    if(camposVazios.length > 0) {
        const plural = camposVazios.length > 1;
        const listarCampos = camposVazios.join(', ');

        const mensagem = plural
            ? `Os campos ${listarCampos} são obrigatórios!`
            : `O campo ${listarCampos} é `;
        
        throw new RequisicaoInvalidada(mensagem);
    };
};

export default validarCamposObrigatorios;