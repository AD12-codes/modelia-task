import type { User } from '../db/schema';
import * as userRepository from '../repositories/user.repository';
import { ConflictError, UnauthorizedError, ValidationError } from '../utils/errors';
import { generateToken } from '../utils/jwt';
import { comparePassword, hashPassword } from '../utils/password';

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}
export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  const { fullName, email, password } = data;

  if (!fullName || !email || !password) {
    throw new ValidationError('Full name, email, and password are required');
  }

  if (password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters long');
  }

  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }
  const hashedPassword = await hashPassword(password);

  const user = await userRepository.createUser({
    fullName,
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  const token = generateToken({ userId: user.id, email: user.email });

  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const { email, password } = data;

  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }
  const user = await userRepository.findUserByEmail(email.toLowerCase());
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }
  const token = generateToken({ userId: user.id, email: user.email });

  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};

export const getCurrentUser = async (userId: string): Promise<Omit<User, 'password'>> => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
