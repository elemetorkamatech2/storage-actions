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
      $domain: 'example.com',
      $typeOfDomain: 'my-example-domain.co.uk',
      $cpu: 686,
      $memory: 16,
      $userId: 'string',
      $status: 'string',
      $backups: [],
    },
  },
};

const options = {
  watch: false,
};

swaggerAutogen(outputFile, endpointsFiles, doc, options);
