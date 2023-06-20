const mongoose = require('mongoose');

const websiteSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  domain: [{
    type: String,
  }],
  typeOfDomain: {
    type: String,
    required: true,
  },
  cpu: {
    type: Number,
    required: true,
  },
  memory: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'ready to use', 'start', 'stop', 'delete', 'backup'],
    default: 'NEW',
  },
  backups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Backup',
  }],
  userId: [{
    type: String,
    required: true,
  }],
});

const Website = mongoose.model('websiteModel', websiteSchema);
module.exports = Website;
