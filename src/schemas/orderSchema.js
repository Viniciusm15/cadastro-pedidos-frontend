import dayjs from 'dayjs';
import * as yup from 'yup';

export const orderSchema = yup.object().shape({
  orderDate: yup
    .date()
    .transform((value) => (dayjs.isDayjs(value) ? value.toDate() : value))
    .typeError('A data do pedido é inválida')
    .max(new Date(), 'A data do pedido não pode ser no futuro')
    .required('A data do pedido é obrigatória'),

  totalValue: yup
    .number()
    .positive('O valor total deve ser maior que zero')
    .required('O valor total é obrigatório')
    .moreThan(0, 'O valor total deve ser maior que zero'),

  clientId: yup.number().positive('O cliente do cliente é obrigatório').required('O cliente é obrigatório'),

  orderItems: yup
    .array()
    .min(1, 'Adicione ao menos um produto no pedido')
    .required('Os itens do pedido são obrigatórios')
});
