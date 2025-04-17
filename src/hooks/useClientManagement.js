import { clientService } from '@/api/clientService';
import { clientSchema } from '@/schemas/clientSchema';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export default function useClientManagement() {
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    telephone: '',
    birthDate: dayjs()
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const { data } = await clientService.fetchAll();
    setClients(data);
  };

  const openModal = (type, row = {}) => {
    setFormState({
      ...row,
      birthDate: row.birthDate ? dayjs(row.birthDate) : dayjs()
    });
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRowId(null);
  };

  const handleCreate = () => openModal('create');

  const handleActionWithSelectedClient = (action) => {
    const selected = clients.find(({ clientId }) => clientId === selectedRowId);
    if (selected) {
      setSelectedClient(selected);
      action({
        ...selected,
        birthDate: dayjs(selected.birthDate)
      });
    }
  };

  const handleEdit = () => handleActionWithSelectedClient((clientData) => openModal('edit', clientData));

  const handleView = () => handleActionWithSelectedClient((clientData) => openModal('view', clientData));

  const handleDelete = async () => {
    if (selectedRowId) {
      await clientService.remove(selectedRowId);
      setClients((prev) => prev.filter(({ clientId }) => clientId !== selectedRowId));
      setSelectedRowId(null);
    }
  };

  const handleInputChange = ({ target: { name, value } }) => setFormState((prev) => ({ ...prev, [name]: value }));

  const handleDateChange = (date) =>
    setFormState((prevState) => ({
      ...prevState,
      birthDate: date && dayjs(date).isValid() ? dayjs(date) : prevState.birthDate
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clientData = {
      ...formState,
      birthDate: formState.birthDate.format('YYYY-MM-DD')
    };

    try {
      await clientSchema.validate(formState, { abortEarly: false });
      setFormErrors({});

      if (modalType === 'create') {
        await clientService.create(clientData);
      } else if (modalType === 'edit') {
        await clientService.update(selectedRowId, clientData);
      }

      closeModal();
      fetchClients();
    } catch (err) {
      if (err.name === 'ValidationError') {
        const errors = {};
        err.inner.forEach((validationError) => {
          errors[validationError.path] = validationError.message;
        });
        setFormErrors(errors);
      }
    }
  };

  return {
    clients,
    isModalOpen,
    modalType,
    selectedRowId,
    selectedClient,
    formState,
    setSelectedRowId,
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    handleInputChange,
    handleDateChange,
    handleSubmit,
    formErrors,
    closeModal
  };
}
