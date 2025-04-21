import dayjs from 'dayjs';
import * as yup from 'yup';

export const clientSchema = yup.object().shape({
  name: yup.string().required('Insira o nome completo.').max(100, 'Nome muito longo (máx. 100 caracteres).'),

  email: yup
    .string()
    .required('Insira um e-mail.')
    .email('E-mail inválido.')
    .max(256, 'E-mail muito longo (máx. 256 caracteres).'),

  telephone: yup
    .string()
    .required('Insira um telefone.')
    .max(20, 'Telefone muito longo (máx. 20 caracteres).')
    .matches(
      /^(\+\d{1,3}\s?)?(\(?\d{2}\)?\s?)?\d{4,5}\-?\d{4}$/,
      'Formato inválido. Exemplos: (99) 99999-9999, +55 (99) 9999-9999.'
    ),

  birthDate: yup
    .date()
    .transform((value) => (dayjs.isDayjs(value) ? value.toDate() : value))
    .typeError('Data inválida.')
    .max(new Date(), 'A data deve ser anterior a hoje.')
    .required('Insira a data de nascimento.')
});
