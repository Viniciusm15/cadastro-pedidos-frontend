import * as yup from 'yup';

export const categorySchema = yup.object().shape({
  name: yup
    .string()
    .required('O nome é obrigatório')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
  description: yup
    .string()
    .required('A descrição é obrigatória')
    .max(500, 'A descrição deve ter no máximo 500 caracteres')
});
