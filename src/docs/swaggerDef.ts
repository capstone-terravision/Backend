import { version } from '../../package.json';

const localhostUrl = 'http://localhost:8080/v1';
const productionUrl = 'https://backend-dot-c241-ps263-capstone.et.r.appspot.com/v1';

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Terravision API documentation',
    version: version,
  },
  servers: [
    {
      url: localhostUrl,
    },
    {
      url: productionUrl,
    },
  ],
};

export default swaggerDef;
