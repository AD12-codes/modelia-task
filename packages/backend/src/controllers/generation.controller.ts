import type { NextFunction, Request, Response } from 'express';
import * as generationService from '../services/generation.service';

export const generate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { prompt } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'Image file is required',
      });
      return;
    }

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: 'Prompt is required',
      });
      return;
    }

    const inputImageUrl = `/uploads/${req.file.filename}`;

    const generation = await generationService.generateImage(userId, inputImageUrl, prompt.trim());

    res.status(201).json({
      success: true,
      message: 'Image generated successfully',
      generation,
    });
  } catch (error) {
    next(error);
  }
};

export const getGenerations = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    const generations = await generationService.getUserGenerations(userId);

    res.json({
      success: true,
      generations,
    });
  } catch (error) {
    next(error);
  }
};

export const getGeneration = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const generation = await generationService.getGenerationById(id);

    if (!generation) {
      res.status(404).json({
        success: false,
        message: 'Generation not found',
      });
      return;
    }

    res.json({
      success: true,
      generation,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGeneration = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const deleted = await generationService.deleteGeneration(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Generation not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Generation deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
