import swaggerAutogen from 'swagger-autogen';

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
  watch: false,
};

swaggerAutogen(outputFile, endpointsFiles, doc, options).then(() => {
});
