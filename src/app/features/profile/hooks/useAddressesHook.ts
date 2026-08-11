import { useState } from 'react';
import { useAddressesQuery } from '@/app/tanstack-queries/addressesQuery';
import { useCreateAddressMutation } from '../mutations/useCreateAddressMutation';
import { useUpdateAddressMutation } from '../mutations/useUpdateAddressMutation';
import { useDeleteAddressMutation } from '../mutations/useDeleteAddressMutation';
import { useSetDefaultAddressMutation } from '../mutations/useSetDefaultAddressMutation';
import type { Address, AddressPayload } from '../types';

/**
 * Estado de la pestaña "Mis direcciones": lista + alta/edición + borrado con
 * confirmación + marcar predeterminada. La data vive en la query compartida
 * (la misma que usa el checkout para preseleccionar).
 */
export function useAddressesHook() {
  const { data: addresses = [], isLoading } = useAddressesQuery();
  const createMutation = useCreateAddressMutation();
  const updateMutation = useUpdateAddressMutation();
  const deleteMutation = useDeleteAddressMutation();
  const defaultMutation = useSetDefaultAddressMutation();

  // Formulario: abierto/cerrado y a qué dirección edita (null = alta nueva).
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  // Confirmación de borrado inline (id de la dirección a confirmar).
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const startCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const startEdit = (address: Address) => {
    setEditing(address);
    setFormOpen(true);
  };

  const cancelForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const submitForm = (payload: AddressPayload) => {
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, payload },
        { onSuccess: cancelForm },
      );
    } else {
      createMutation.mutate(payload, { onSuccess: cancelForm });
    }
  };

  const confirmDelete = (id: string) => {
    deleteMutation.mutate(id, { onSuccess: () => setConfirmDeleteId(null) });
  };

  return {
    addresses,
    isLoading,
    formOpen,
    editing,
    isSaving: createMutation.isPending || updateMutation.isPending,
    startCreate,
    startEdit,
    cancelForm,
    submitForm,
    confirmDeleteId,
    requestDelete: setConfirmDeleteId,
    cancelDelete: () => setConfirmDeleteId(null),
    confirmDelete,
    isDeleting: deleteMutation.isPending,
    deletingId: deleteMutation.variables,
    markDefault: (id: string) => defaultMutation.mutate(id),
    isMarkingDefault: defaultMutation.isPending,
    markingDefaultId: defaultMutation.variables,
  };
}
