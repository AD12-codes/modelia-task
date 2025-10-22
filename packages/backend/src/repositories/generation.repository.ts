import { desc, eq } from 'drizzle-orm';
import { db } from '../db';
import { type Generation, type NewGeneration, generations } from '../db/schema';

export const createGeneration = async (generationData: NewGeneration): Promise<Generation> => {
  const [generation] = await db.insert(generations).values(generationData).returning();
  return generation;
};

export const findGenerationsByUserId = async (userId: string, limit = 5): Promise<Generation[]> => {
  return db
    .select()
    .from(generations)
    .where(eq(generations.userId, userId))
    .orderBy(desc(generations.createdAt))
    .limit(limit);
};

export const findGenerationById = async (id: string): Promise<Generation | undefined> => {
  const [generation] = await db.select().from(generations).where(eq(generations.id, id)).limit(1);
  return generation;
};

export const deleteGenerationById = async (id: string): Promise<boolean> => {
  const result = await db.delete(generations).where(eq(generations.id, id)).returning();
  return result.length > 0;
};
