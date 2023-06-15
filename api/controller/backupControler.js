const Backup = require('../models/backupModel');
const Website=require('../models/websiteModel')
const logger = require('../../logger');

module.exports = {



create: async (req, res) => {
    try {
        const websiteToBackup = await Website.findById(req.params.id).exec();
        if (!websiteToBackup) return res.status(404).send('Website not found!');
        if (websiteToBackup.backup) return res.status(404).send('This website is already backed up');
    
        const backupWebsiteData = {
          ...websiteToBackup.toObject(),
           status: 'backup',
          _id: undefined
        };
    
        const backupWebsite = await new Website(backupWebsiteData).save();
        
        const backup = await new Backup({
          siteId: websiteToBackup._id,
          description: websiteToBackup.description
        }).save();

       
       websiteToBackup.backup=backup._id;
       await websiteToBackup.save();


        return res.status(200).send('Backup created successfully');
    
      } catch (err) {
        return res.status(500).send({ error: err.message });
      }
}
   }
