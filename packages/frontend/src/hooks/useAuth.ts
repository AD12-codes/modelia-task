import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { type LoginData, type RegisterData, authService } from '../services/auth.service';

export const useAuthQuery = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      if (!authService.isAuthenticated()) {
        return null;
      }
      const response = await authService.getCurrentUser();
      return response.data || null;
    },
    retry: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginData) => authService.login(data),
    onSuccess: (response) => {
      if (response.data) {
        queryClient.setQueryData(['auth', 'me'], response.data.user);
        navigate({ to: '/dashboard' });
      }
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (response) => {
      if (response.data) {
        queryClient.setQueryData(['auth', 'me'], response.data.user);
        navigate({ to: '/dashboard' });
      }
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'me'], null);
      queryClient.clear();
      navigate({ to: '/login' });
    },
  });
};
