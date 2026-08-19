class TextoHelper {

    public static sanitizarNome(nome: string): string {
        if(!nome) return '';

        return nome

            //Remove tags XML/HTML, evitando scripts maliciosos:
            .replace(/<[^>]/g,'')

            //Mantém apenas letras, caracteres latinos e espaços:
            .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g,'')

            //Substitui multiplos espaços seguidos por um único espaço:
            .replace(/\s+/g,'')

            //Remove espaços anteriores e posteriores aos nomes:
            .trim();
    };
}

export default TextoHelper;