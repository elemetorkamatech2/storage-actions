const mongoose = require('mongoose');

const websiteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  domain: [{
    type: String
  }],
  typeOfDomain: {
    type: String,
    required: true
  },
  cpu: {
    type: Number,
    required: true
  },
  memory: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  backups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Backup'
  }]
});

const Website = mongoose.model('Website', websiteSchema);

module.exports = Website;