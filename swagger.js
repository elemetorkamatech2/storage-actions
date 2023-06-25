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
  definitions: {
    addWebsite: {
      $title: 'string',
      $description: 'string',
      $domain: 'string',
      $typeOfDomain: 'string',
      $cpu: 'string',
      $memory: 'string',
      $userId: ['string'],
      $status: 'string',
      $backups: [],
    },
  },
};

const options = {
  watch: false,
};

swaggerAutogen(outputFile, endpointsFiles, doc, options).then(() => {
});
