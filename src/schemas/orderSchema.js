import dayjs from 'dayjs';
import * as yup from 'yup';

export const orderSchema = yup.object().shape({
  orderDate: yup
    .date()
    .transform((value) => (dayjs.isDayjs(value) ? value.toDate() : value))
    .typeError('Data inválida.')
    .max(new Date(), 'A data não pode ser futura.')
    .required('Informe a data do pedido.'),

  clientId: yup.number().positive('ID do cliente inválido.').required('Selecione um cliente.'),

  orderItems: yup.array().min(1, 'Adicione pelo menos um item ao pedido.').required('Adicione os itens do pedido.')
});
