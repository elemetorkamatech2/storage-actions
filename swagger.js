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

const options = {
  watch: false, // Disable Swagger-autogen watch mode
};

swaggerAutogen(outputFile, endpointsFiles, doc, options).then(() => {
  console.log('Swagger documentation generated successfully');
});
