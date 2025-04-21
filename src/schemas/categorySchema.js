import * as yup from 'yup';

export const categorySchema = yup.object().shape({
  name: yup.string().required('Insira um nome para a categoria.').max(100, 'Nome muito longo (máx. 100 caracteres)'),
  description: yup.string().required('Adicione uma descrição.').max(500, 'Descrição muito longa (máx. 500 caracteres).')
});
