import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generationService } from '../services/generation.service';

export const useGenerations = () => {
  return useQuery({
    queryKey: ['generations'],
    queryFn: () => generationService.getGenerations(),
  });
};

export const useGenerate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ image, prompt }: { image: File; prompt: string }) =>
      generationService.generate(image, prompt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generations'] });
    },
  });
};

export const useDeleteGeneration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => generationService.deleteGeneration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generations'] });
    },
  });
};
