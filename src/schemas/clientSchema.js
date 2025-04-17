import * as yup from 'yup';
import dayjs from 'dayjs';

export const clientSchema = yup.object().shape({
  name: yup.string().required('O nome é obrigatório').max(100, 'O nome deve ter no máximo 100 caracteres'),

  email: yup
    .string()
    .required('O e-mail é obrigatório')
    .email('Formato de e-mail inválido')
    .max(256, 'O e-mail deve ter no máximo 256 caracteres'),

  telephone: yup
    .string()
    .required('O telefone é obrigatório')
    .max(20, 'O telefone deve ter no máximo 20 caracteres')
    .matches(
      /^(\+\d{1,3}\s?)?(\(?\d{2}\)?\s?)?\d{4,5}\-?\d{4}$/,
      'Número de telefone inválido. Formatos aceitos: +xx (xx) xxxxx-xxxx, (xx) xxxxx-xxxx, xxxxxxxxxxx.'
    ),

    birthDate: yup
    .date()
    .transform((value) => (dayjs.isDayjs(value) ? value.toDate() : value))
    .typeError('A data de nascimento é inválida')
    .max(new Date(), 'A data de nascimento deve estar no passado')
    .required('A data de nascimento é obrigatória')
});
