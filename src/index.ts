import { createServer, Server } from 'http';
import app from './app';
import logger from './configs/logger';

let server: Server;

const startServer = () => {
  server = createServer(app);
  server.listen(process.env.PORT, () => {
    logger.info(`Listening to port ${process.env.PORT}`);
  });
};

startServer();

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
