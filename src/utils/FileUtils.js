/**
 * Converte uma string Base64 para um objeto File simulando um upload
 * @param {string} base64Data - Dados da imagem em Base64 (sem o prefixo data:)
 * @param {string} filename - Nome do arquivo a ser criado
 * @param {string} mimeType - Tipo MIME (ex: 'image/png')
 * @returns {File} Objeto File pronto para upload
 * @throws {Error} Se os parâmetros forem inválidos
 */
export const base64ToFile = (base64Data, filename, mimeType) => {
  if (!base64Data || !filename || !mimeType) {
    throw new Error('Todos os parâmetros são obrigatórios');
  }

  try {
    const byteString = atob(base64Data);
    const buffer = new ArrayBuffer(byteString.length);
    const bytes = new Uint8Array(buffer);
    
    for (let i = 0; i < byteString.length; i++) {
      bytes[i] = byteString.charCodeAt(i);
    }

    return new File([buffer], filename, { type: mimeType });
  } catch (error) {
    throw new Error(`Falha na conversão Base64 para File: ${error.message}`);
  }
};

/**
 * Valida se um arquivo é uma imagem válida
 * @param {File} file - Objeto File a ser validado
 * @returns {boolean}
 */
export const isValidImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return file && validTypes.includes(file.type);
};
