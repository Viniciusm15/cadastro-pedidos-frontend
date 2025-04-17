import * as yup from 'yup';

export const productSchema = yup.object().shape({
  name: yup.string().required('O nome é obrigatório').max(100, 'O nome deve ter no máximo 100 caracteres'),

  description: yup.string().required('A descrição é obrigatória'),

  price: yup
    .number()
    .typeError('O preço deve ser um número')
    .min(0, 'O preço deve ser maior ou igual a zero')
    .required('O preço é obrigatório'),

  stockQuantity: yup
    .number()
    .typeError('A quantidade deve ser um número')
    .integer('A quantidade deve ser um número inteiro')
    .min(0, 'A quantidade deve ser maior ou igual a zero')
    .required('A quantidade é obrigatória'),

  categoryId: yup
    .string()
    .matches(/^\d+$/, 'O ID da categoria deve ser um número')
    .test('is-positive', 'O ID da categoria deve ser maior que zero', (value) => parseInt(value, 10) > 0)
    .required('A categoria é obrigatória'),

  image: yup.object().required('A imagem é obrigatória.')
});
