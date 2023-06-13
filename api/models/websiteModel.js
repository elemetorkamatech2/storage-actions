const mongoose = require('mongoose');

const websiteSchema = new mongoose.Schema({
  id:{
    type:mongoose.Schema.Types.ObjectId
    },
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
    enum : ['pending', 'ready_to_use', 'start','stop','delete','backup'],
    default: 'no_status'
   },  
  backups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Backup'
  }],
  userId:[{
    type: String,
    required: true
  }]
});

const Website = mongoose.model('Website', websiteSchema);

module.exports = Website;