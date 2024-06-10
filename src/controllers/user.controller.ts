import { Request, Response } from 'express';
import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { userService } from '../services';
import MiniSearch, { Query } from 'minisearch';
import jwt from 'jsonwebtoken';

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

export const querAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'sortOrder']);

  if (options.limit) {
    options.limit = parseInt(options.limit, 10);
  }
  if (options.page) {
    options.page = parseInt(options.page, 10);
  }

  const users = await userService.queryUsers(filter, options);

  const data = users.map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    password: user.password,
    created_at: user.created_at,
    updated_at: user.updated_at,
  }));
  res.status(httpStatus.OK).json({
    error: false,
    message: 'User retrieve Successfully!',
    data,
  });
});

export const searchUsers = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'sortOrder']);

  if (options.limit) {
    options.limit = parseInt(options.limit, 10);
  }
  if (options.page) {
    options.page = parseInt(options.page, 10);
  }

  const users = await userService.queryUsers(filter, options);

  const miniSearch = new MiniSearch({
    fields: ['name', 'email'],
    storeFields: ['id', 'email', 'name', 'password', 'token', 'created_at', 'updated_at'],
  });
  miniSearch.addAll(users);
  const results = miniSearch.search(req.query.q as Query);
  const data = results.map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    password: user.password,
    created_at: user.created_at,
    updated_at: user.updated_at,
  }));
  res.status(httpStatus.OK).json({
    error: false,
    message: 'User retrieve Successfully!',
    data,
  });
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string);

  const data = await userService.getUserById(decoded.sub as string);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.status(httpStatus.OK).json({
    error: false,
    message: 'User retrieve Successfully!',
    data,
  });
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});
