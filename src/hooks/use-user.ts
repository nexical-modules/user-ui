import { useState, useEffect } from 'react';
import { api } from '@/lib/api/api';
import { UserModuleTypes } from '@/lib/api';

interface MutationOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
  [key: string]: unknown;
}

export function useUserQuery(options?: Record<string, unknown>) {
  const [data, setData] = useState<UserModuleTypes.User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    setIsLoading(true);
    try {
      const res = await api.user.list();
      // Handle envelope
      const list = (Array.isArray(res) ? res : res.data || []) as UserModuleTypes.User[];
      setData(list);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { data, isLoading, error, refetch };
}

export function useCreateUser() {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (data: UserModuleTypes.CreateUserDTO, options?: MutationOptions) => {
    setIsPending(true);
    try {
      const res = await api.user.create(data);
      options?.onSuccess?.(res);
    } catch (e) {
      options?.onError?.(e);
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
}

export function useUpdateUser(hookId?: string) {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (
    variables:
      | UserModuleTypes.UpdateUserDTO
      | { id: string; data: Omit<UserModuleTypes.UpdateUserDTO, 'id'> },
    options?: MutationOptions,
  ) => {
    let id = hookId;
    let data: UserModuleTypes.UpdateUserDTO;

    if ('data' in variables && 'id' in variables) {
      id = variables.id;
      // Combine id and data to match UpdateUserDTO
      data = { ...variables.data, id } as UserModuleTypes.UpdateUserDTO;
    } else {
      data = variables as UserModuleTypes.UpdateUserDTO;
      if (!id && data.id) id = data.id;
    }

    if (!id) {
      console.error('useUpdateUser: Missing ID');
      return;
    }

    setIsPending(true);
    try {
      const res = await api.user.update(id, data);
      options?.onSuccess?.(res);
    } catch (e) {
      options?.onError?.(e);
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
}

export function useDeleteUser() {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (id: string, options?: MutationOptions) => {
    setIsPending(true);
    try {
      const res = await api.user.delete(id);
      options?.onSuccess?.(res);
    } catch (e) {
      options?.onError?.(e);
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
}
