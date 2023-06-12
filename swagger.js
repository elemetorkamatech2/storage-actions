const swaggerAutogen = require('swagger-autogen');

const outputFile = '.swagger_output.json';
const endpointsFiles = ['.api/routes/backupRouter.js','.api/routes/websiteRouter.js'];

const doc = {
    tags: [
        {
            name: 'backup',
        },
        {
            name: 'website',
        },
    ],
}

swaggerAutogen(outputFile, endpointsFiles, doc).then(()=>{
    require('./app');
})