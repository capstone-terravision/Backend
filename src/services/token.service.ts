import jwt from 'jsonwebtoken';
import moment from 'moment';
import httpStatus from 'http-status';
import * as userService from './user.service';
import ApiError from '../utils/ApiError';
import { tokenTypes } from '../configs/token';
import prisma from '../utils/prisma';
import { Token, User } from '@prisma/client';
import { Request } from 'express';

/**
 * Generate token
 * @param {string} userId
 * @param {moment.Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (
  userId: string,
  expires: Date,
  type: string,
  secret: string = process.env.JWT_SECRET as string,
): string => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: moment(expires).unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {string} userId
 * @param {moment.Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (
  token: string,
  userId: string,
  expires: Date,
  type: string,
  blacklisted: boolean = false,
): Promise<Token> => {
  return prisma.token.create({
    data: {
      token,
      userId,
      expires,
      type,
      blacklisted,
    },
  });
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token: string, type: string): Promise<Token | null> => {
  const foundToken = await prisma.token.findFirst({
    where: {
      token,
      type,
      blacklisted: false,
    },
  });
  return foundToken;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<{access: {token: string, expires: Date}, refresh: {token: string, expires: Date}}>}
 */
const generateAuthTokens = async (
  user: User,
): Promise<{
  access: { token: string; expires: Date };
  refresh: { token: string; expires: Date };
}> => {
  const accessTokenExpires = moment().add(process.env.JWT_ACCESS_EXPIRATION_MINUTES, 'minutes').toDate();
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(process.env.JWT_REFRESH_EXPIRATION_DAYS, 'days').toDate();
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires,
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires,
    },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email: string): Promise<string> => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  const expires = moment().add(process.env.JWT_ACCESS_EXPIRATION_MINUTES, 'minutes').toDate(); // Convert Moment to Date
  const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user: any): Promise<string> => {
  const expires = moment().add(process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES, 'minutes').toDate();
  const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};

/**
 * Extract and verify JWT token from request headers
 * @param {Request} req - Express request object
 * @returns {string | object} - The decoded JWT payload
 * @throws {Error} - Throws an error if token is missing or invalid
 */
const extractAndVerifyToken = (req: Request) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
  extractAndVerifyToken,
};
