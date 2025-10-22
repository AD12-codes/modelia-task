import type { Generation } from '../db/schema';
import * as generationRepository from '../repositories/generation.repository';

const SIMULATED_OUTPUTS = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
  'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
  'https://images.unsplash.com/photo-1511511450040-677116ff389e?w=800',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800',
];

const simulateProcessingDelay = async (): Promise<void> => {
  const delay = Math.random() * 2000 + 1000; // 1-3 seconds
  return new Promise((resolve) => setTimeout(resolve, delay));
};

const simulateAIGeneration = async (inputImageUrl: string, prompt: string): Promise<string> => {
  await simulateProcessingDelay();

  const outputImageUrl = SIMULATED_OUTPUTS[Math.floor(Math.random() * SIMULATED_OUTPUTS.length)];

  return outputImageUrl;
};

export const generateImage = async (
  userId: string,
  inputImageUrl: string,
  prompt: string,
): Promise<Generation> => {
  try {
    const outputImageUrl = await simulateAIGeneration(inputImageUrl, prompt);

    const generation = await generationRepository.createGeneration({
      userId,
      prompt,
      inputImageUrl,
      outputImageUrl,
      status: 'completed',
    });

    return generation;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    const failedGeneration = await generationRepository.createGeneration({
      userId,
      prompt,
      inputImageUrl,
      outputImageUrl: inputImageUrl,
      status: 'failed',
      errorMessage,
    });

    throw error;
  }
};

export const getUserGenerations = async (userId: string): Promise<Generation[]> => {
  return generationRepository.findGenerationsByUserId(userId, 5);
};

export const getGenerationById = async (id: string): Promise<Generation | undefined> => {
  return generationRepository.findGenerationById(id);
};

export const deleteGeneration = async (id: string): Promise<boolean> => {
  return generationRepository.deleteGenerationById(id);
};
