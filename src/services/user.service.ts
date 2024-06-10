import { User } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import prisma from '../utils/prisma';
import { hashPassword } from '../utils/password';

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

/**
 * Create a user
 * @param {CreateUserInput} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody: CreateUserInput): Promise<User> => {
  const hashedPassword = await hashPassword(userBody.password);

  return prisma.user.create({
    data: {
      ...userBody,
      password: hashedPassword,
    },
  });
};

/**
 * Query for users
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async <Key extends keyof User>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: string;
  },
  keys: Key[] = ['id', 'email', 'name', 'password', 'token', 'created_at', 'updated_at'] as Key[],
): Promise<Pick<User, Key>[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortOrder = options.sortOrder ?? 'asc';

  const user = await prisma.user.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    take: limit,
    skip: (page - 1) * limit,
    orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
  });
  return user as Pick<User, Key>[];
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<User | null>}
 */
const getUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id } });
};

/**
 * Get user by email
 * @param {string} email
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserByEmail = async <Key extends keyof User>(
  email: string,
  keys: Key[] = ['id', 'name', 'email', 'password', 'token', 'created_at', 'updated_at'] as Key[],
): Promise<Pick<User, Key> | null> => {
  try {
    return prisma.user.findUnique({
      where: { email },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    }) as Promise<Pick<User, Key> | null>;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Unable to find user with email ${email}: ${error.message}`);
    } else {
      throw new Error(`Unable to find user with email ${email}: Unknown error`);
    }
  }
};

/**
 * Update user by id
 * @param {string} userId
 * @param {Partial<CreateUserInput>} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId: string, updateBody: Partial<CreateUserInput>): Promise<User> => {
  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email) {
    const existingEmailUser = await prisma.user.findUnique({
      where: { email: updateBody.email },
    });
    if (existingEmailUser && existingEmailUser.id !== userId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
  }
  return prisma.user.update({ where: { id: userId }, data: updateBody });
};

/**
 * Delete user by id
 * @param {string} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId: string): Promise<User> => {
  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return prisma.user.delete({ where: { id: userId } });
};

export { createUser, queryUsers, getUserById, getUserByEmail, updateUserById, deleteUserById };
