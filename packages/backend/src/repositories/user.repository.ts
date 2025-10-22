import { eq } from 'drizzle-orm';
import { db } from '../db/index';
import { type NewUser, type User, users } from '../db/schema';

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0];
};

export const findUserById = async (id: string): Promise<User | undefined> => {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
};

export const createUser = async (
  userData: Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<User> => {
  const result = await db.insert(users).values(userData).returning();
  return result[0];
};

export const updateUser = async (
  id: string,
  userData: Partial<Omit<User, 'id' | 'createdAt'>>,
): Promise<User | undefined> => {
  const result = await db
    .update(users)
    .set({ ...userData, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return result[0];
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const result = await db.delete(users).where(eq(users.id, id)).returning();
  return result.length > 0;
};
