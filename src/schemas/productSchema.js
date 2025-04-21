import * as yup from 'yup';

export const productSchema = yup.object().shape({
  name: yup.string().required('Insira um nome para o produto.').max(100, 'Nome muito longo (máx. 100 caracteres)'),

  description: yup.string().required('Adicione uma descrição.'),

  price: yup
    .number()
    .typeError('O preço deve ser um número.')
    .min(0, 'O preço deve ser maior ou igual a zero.')
    .required('O preço é obrigatório.'),

  stockQuantity: yup
    .number()
    .typeError('A quantidade deve ser um número.')
    .integer('A quantidade deve ser um número inteiro.')
    .min(0, 'A quantidade deve ser maior ou igual a zero.')
    .required('Defina a quantidade disponível.'),

  categoryId: yup
    .string()
    .matches(/^\d+$/, 'O ID da categoria deve ser um número.')
    .test('is-positive', 'O ID da categoria deve ser maior que zero.', (value) => parseInt(value, 10) > 0)
    .required('Selecione uma categoria para o produto.'),

  image: yup.object().required('Envie uma imagem do produto (JPEG ou PNG).')
});
