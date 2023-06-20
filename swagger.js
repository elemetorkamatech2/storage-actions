// eslint-disable-next-line import/no-unresolved
const swaggerAutogen = require('swagger-autogen');

const outputFile = './swagger_output.json';
const endpointsFiles = ['./api/routes/websiteRouter.js'];

const doc = {
  tags: [
    {
      name: 'backup',
    },
    {
      name: 'website',
    },
  ],
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  // eslint-disable-next-line global-require
  require('./app');
});
