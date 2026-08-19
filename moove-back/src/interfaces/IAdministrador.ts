interface IAdministrador {
    id: number;
    nome: string;
    cpf: string;
    email: string;
    senha: string;
    numeroWhatsApp: string;
    whatsAppLid?: string;
}

export default IAdministrador;