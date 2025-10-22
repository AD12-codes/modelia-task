import { api } from './api';

export interface Generation {
  id: string;
  userId: string;
  prompt: string;
  inputImageUrl: string;
  outputImageUrl: string;
  status: 'completed' | 'failed';
  errorMessage?: string | null;
  createdAt: string;
}

export interface GenerateResponse {
  success: boolean;
  message: string;
  generation: Generation;
}

export interface GenerationsResponse {
  success: boolean;
  generations: Generation[];
}

export const generationService = {
  generate: async (image: File, prompt: string): Promise<GenerateResponse> => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('prompt', prompt);

    const response = await api.postFormData<GenerateResponse>('/generations', formData);
    return response as unknown as GenerateResponse;
  },

  getGenerations: async (): Promise<Generation[]> => {
    const response = await api.get<GenerationsResponse>('/generations');
    return (response as unknown as GenerationsResponse).generations;
  },

  getGeneration: async (id: string): Promise<Generation> => {
    const response = await api.get<{ success: boolean; generation: Generation }>(
      `/generations/${id}`,
    );
    return (response as unknown as { success: boolean; generation: Generation }).generation;
  },

  deleteGeneration: async (id: string): Promise<void> => {
    await api.delete<{ success: boolean; message: string }>(`/generations/${id}`);
  },
};
