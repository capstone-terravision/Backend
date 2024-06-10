import express from 'express';
import validate from '../../middlewares/validate';
import authValidation from '../../validations/auth.validation';
import * as authController from '../../controllers/auth.controller';
import { authorizationUrl } from '../../configs/googleOauth2';

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);

router.get('/google', (_, res) => {
  res.redirect(authorizationUrl);
});

router.get('/google/callback', authController.googleOauth);

router.post('/refresh-token', validate(authValidation.refreshTokens), authController.refreshTokens);

export default router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register as user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 error: false
 *                 message: Register successful
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                     refresh_token:
 *                       type: string
 *               example:
 *                 error: false
 *                 message: Login successful
 *                 data:
 *                   access_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwNmY1MWRmZS0zNWY5LTQzMzQtODJhZC01ZTM0YWY4ZTA1ZDMiLCJpYXQiOjE3MTc5ODQ2NzEsImV4cCI6MTcxNzk4NjQ3MSwidHlwZSI6ImFjY2VzcyJ9.6Yn4xrn5l_0TiRrNa_KKzNt-Yc-9YRTNACtxbJDOnYg
 *                   refresh_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwNmY1MWRmZS0zNWY5LTQzMzQtODJhZC01ZTM0YWY4ZTA1ZDMiLCJpYXQiOjE3MTc5ODQ2NzEsImV4cCI6MTcyMDU3NjY3MSwidHlwZSI6InJlZnJlc2gifQ.spm5Ozd6SY16f0waAjM6_Iso9iw2cfCGavhmjuW1HAc
 *       "401":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Invalid email or password
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *     responses:
 *       "204":
 *         description: No content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               error: false
 *               message: Logout successful
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh auth tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     expires:
 *                       type: string
 *                       format: date-time
 *                 refresh:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     expires:
 *                       type: string
 *                       format: date-time
 *               example:
 *                 access:
 *                   token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwNmY1MWRmZS0zNWY5LTQzMzQtODJhZC01ZTM0YWY4ZTA1ZDMiLCJpYXQiOjE3MTc5ODQ4NDQsImV4cCI6MTcxNzk4NjY0NCwidHlwZSI6ImFjY2VzcyJ9.OSOsBD4eCapJRiGwpi-kqtNkcWCPqdVWJKQvl296XO8
 *                   expires: 2024-06-10T02:30:44.219Z
 *                 refresh:
 *                   token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwNmY1MWRmZS0zNWY5LTQzMzQtODJhZC01ZTM0YWY4ZTA1ZDMiLCJpYXQiOjE3MTc5ODQ4NDQsImV4cCI6MTcyMDU3Njg0NCwidHlwZSI6InJlZnJlc2gifQ.NyySBCJd_m2IunC0tjNNbsqVWtRgbTHbrcrGUrFn08Y
 *                   expires: 2024-07-10T02:00:44.221Z
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Redirect to Google OAuth2 authorization URL
 *     tags: [Auth]
 *     responses:
 *       "302":
 *         description: Redirects to Google OAuth2 authorization URL
 */

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth2 callback
 *     tags: [Auth]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Unauthorized
 */

/**
 * @swagger
 * components:
 *   schemas:

 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the user
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [user, admin]
 *       example:
 *         id: 60d0fe4f5311236168a109ca
 *         name: John Doe
 *         email: john.doe@example.com
 *         role: user
 *     AuthTokens:
 *       type: object
 *       properties:
 *         access:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *             expires:
 *               type: string
 *               format: date-time
 *         refresh:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *             expires:
 *               type: string
 *               format: date-time
 *       example:
 *         access:
 *           token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *           expires: 2021-08-01T00:00:00.000Z
 *         refresh:
 *           token: dGhpcyBpcyBhIHNhbXBsZSByZWZyZXNoIHRva2Vu
 *           expires: 2021-08-01T00:00:00.000Z
 *     Error:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           format: int32
 *         message:
 *           type: string
 *       example:
 *         code: 401
 *         message: Unauthorized
 *   responses:
 *     DuplicateEmail:
 *       description: Email is already in use
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *           example:
 *             code: 400
 *             message: Email is already in use
 *     NotFound:
 *       description: Not Found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *           example:
 *             code: 404
 *             message: Not Found
 *     Unauthorized:
 *       description: Unauthorized
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *           example:
 *             code: 401
 *             message: Unauthorized
 */
