import express, { Router } from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import docsRoute from './docs.route';
import postRoute from './post.route';

const router: Router = express.Router();

// Define default routes
const defaultRoutes: { path: string; route: Router }[] = [
  { path: '/auth', route: authRoute },
  { path: '/users', route: userRoute },
  { path: '/post', route: postRoute },
];

// Define development-only routes
const devRoutes: { path: string; route: Router }[] = [{ path: '/docs', route: docsRoute }];

// Register default routes
defaultRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});

devRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
