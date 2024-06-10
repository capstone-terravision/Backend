import httpStatus from 'http-status';
import { verifyToken, generateAuthTokens } from './token.service';
import { getUserByEmail, getUserById, updateUserById } from './user.service';
import ApiError from '../utils/ApiError';
import { tokenTypes } from '../configs/token';
import prisma from '../utils/prisma';
import { User } from '@prisma/client';
import { hashPassword } from '../utils/password';

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<User> => {
  const user = await getUserByEmail(email);
  if (!user || !(await hashPassword(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenDoc = await prisma.token.findFirst({
    where: {
      token: refreshToken,
      type: tokenTypes.REFRESH,
      blacklisted: false,
    },
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await prisma.token.delete({ where: { id: refreshTokenDoc.id } });
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<{ access: { token: string, expires: Date }, refresh: { token: string, expires: Date } }>}
 */
const refreshAuth = async (
  refreshToken: string,
): Promise<{
  access: { token: string; expires: Date };
  refresh: { token: string; expires: Date };
}> => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);
    if (!refreshTokenDoc) {
      throw new Error('Refresh token not found');
    }
    const user = await getUserById(refreshTokenDoc.userId);
    if (!user) {
      throw new Error('User not found');
    }
    await prisma.token.delete({ where: { id: refreshTokenDoc.id } });
    return generateAuthTokens(user);
  } catch (error) {
    console.log(error);

    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
const resetPassword = async (resetPasswordToken: string, newPassword: string): Promise<void> => {
  try {
    const resetPasswordTokenDoc = await verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    if (!resetPasswordTokenDoc) {
      throw new Error('Reset password token not found');
    }

    // Assuming resetPasswordTokenDoc.userId is a valid user ID
    const user = await getUserById(resetPasswordTokenDoc.userId);
    if (!user) {
      throw new Error('User not found');
    }

    await updateUserById(user.id, { password: newPassword });
    await prisma.token.deleteMany({
      where: { user: { id: user.id }, type: tokenTypes.RESET_PASSWORD },
    });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

export { loginUserWithEmailAndPassword, logout, refreshAuth, resetPassword };
