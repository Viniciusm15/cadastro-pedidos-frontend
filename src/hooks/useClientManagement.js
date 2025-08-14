import { clientService } from '@/api/clientService';
import { clientSchema } from '@/schemas/clientSchema';
import { useState, useEffect, useCallback } from 'react';
import { usePagination } from '@/hooks/usePaginationManagement';
import dayjs from 'dayjs';

const INITIAL_FORM_STATE = {
  name: '',
  email: '',
  telephone: '',
  birthDate: dayjs()
};

export function useClientManagement() {
  const [clients, setClients] = useState({ data: [], totalCount: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const pagination = usePagination();

  const resetForm = useCallback(() => {
    setFormState(INITIAL_FORM_STATE);
    setFormErrors({});
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const loadData = useCallback(async () => {
    try {
      const clientsRes = await clientService.fetchAll(pagination.apiParams);
      setClients({
        data: clientsRes.data,
        totalCount: clientsRes.totalCount
      });
    } catch (error) {
      showSnackbar('Error loading clients', 'error');
    }
  }, [pagination.apiParams]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshData = () => {
    loadData();
  };

  const handleOpenModal = useCallback((type, rowData = null) => {
    setFormErrors({});

    if (rowData) {
      setSelectedClient(rowData);
      setFormState({
        ...rowData,
        birthDate: rowData.birthDate ? dayjs(rowData.birthDate) : dayjs()
      });
    } else {
      resetForm();
    }

    setModalType(type);
    setIsModalOpen(true);
  }, [resetForm]);

  const handleCreate = useCallback(() => {
    handleOpenModal('create');
  }, [handleOpenModal]);

  const handleEdit = useCallback(() => {
    if (!selectedRowId) return;
    const client = clients.data.find(c => c.clientId === selectedRowId);
    if (client) handleOpenModal('edit', client);
  }, [selectedRowId, clients.data, handleOpenModal]);

  const handleView = useCallback(() => {
    if (!selectedRowId) return;
    const client = clients.data.find(c => c.clientId === selectedRowId);
    if (client) handleOpenModal('view', client);
  }, [selectedRowId, clients.data, handleOpenModal]);

  const handleDelete = useCallback(async () => {
    if (!selectedRowId) return;

    try {
      await clientService.remove(selectedRowId);
      showSnackbar('Client deleted successfully');
      refreshData();
      setSelectedRowId(null);
    } catch (error) {
      showSnackbar('Error deleting client', 'error');
    }
  }, [selectedRowId]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedRowId(null);
    resetForm();
  }, [resetForm]);

  const handleInputChange = useCallback(({ target: { name, value } }) => {
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleDateChange = useCallback((date) => {
    setFormState(prev => ({
      ...prev,
      birthDate: date && dayjs(date).isValid() ? dayjs(date) : prev.birthDate
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
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
        showSnackbar('Client created successfully');
      } else if (modalType === 'edit') {
        await clientService.update(selectedRowId, clientData);
        showSnackbar('Client updated successfully');
      }

      refreshData();
      handleCloseModal();
    } catch (err) {
      if (err.name === 'ValidationError') {
        const errors = {};
        err.inner.forEach(({ path, message }) => {
          errors[path] = message;
        });
        setFormErrors(errors);
      } else {
        showSnackbar('Error saving client', 'error');
      }
    }
  }, [formState, modalType, selectedRowId, handleCloseModal]);

  return {
    clients,
    isModalOpen,
    modalType,
    selectedRowId,
    selectedClient,
    formState,
    formErrors,
    setSelectedRowId,
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    handleCloseModal,
    handleInputChange,
    handleDateChange,
    handleSubmit,
    refreshData,
    snackbar,
    closeSnackbar,
    pagination
  };
}
