const { encryptData, decryptData } = require('../encryption');

const websiteService = require('../services/website.service');

async function create(encryptedWebsite) {
  // Decrypt the website data
  const website = JSON.parse(decryptData(encryptedWebsite));

  // Save the website to the database
  const result = await websiteService.create(website);

  // Return the result
  return { success: true, message: result.message };
}

module.exports = {
  createWebsite: async (req, res) => {
    // #swagger.parameters['website'] = {
    //   in: 'body',
    //   required: true,
    //   schema: { $ref: "#/definitions/addWebsite" }
    // }
    try {
      // Encrypt the website data
      const website = req.body;
      const encryptedData = encryptData(JSON.stringify(website));

      // Call the websiteService to create the website with the encrypted data
      const result = await create(encryptedData);
      if (result.success) {
        res.status(200).send({ message: result.message });
      } else {
        res.status(412).send({ success: false, message: result.message });
      }
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },
};
