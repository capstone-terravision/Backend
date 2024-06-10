import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { authService, userService, tokenService } from '../services';
import { google } from 'googleapis';
import { oauth2Client } from '../configs/googleOauth2';
import { createUser, getUserByEmail } from '../services/user.service';

const register = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);

  await tokenService.generateAuthTokens(user);

  res.status(httpStatus.CREATED).json({ error: false, message: 'Register successful' });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.OK).json({
    error: false,
    message: 'Login successful',
    data: {
      access_token: tokens.access.token,
      refresh_token: tokens.refresh.token,
    },
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken);
  console.log(req.body.refreshToken);

  res.status(httpStatus.OK).json({
    error: false,
    message: 'Logout successful',
  });
});

const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const googleOauth = catchAsync(async (req: Request, res: Response) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ message: 'Authorization code not provided.' });
  }

  const { tokens } = await oauth2Client.getToken(code as string);
  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2',
  });

  const { data } = await oauth2.userinfo.get();

  if (!data.name || !data.email) {
    return res.status(400).json({ message: 'Google OAuth did not return a name and email.' });
  }

  let user = await getUserByEmail(data.email);

  if (!user) {
    // Since this is OAuth, we don't have a password, so we use a placeholder
    const placeholderPassword = 'OAuthUserPlaceholderPassword';
    const reqBody = {
      name: data.name,
      email: data.email,
      password: placeholderPassword,
    };
    user = await createUser(reqBody);
  }

  const token = await tokenService.generateAuthTokens(user);

  return res.status(200).json({ error: false, message: 'Login successful', token: token.access.token });
});

export { register, login, logout, refreshTokens, googleOauth };
