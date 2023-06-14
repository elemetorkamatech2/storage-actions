const mongoose = require('mongoose');

const backupSchema = new mongoose.Schema({
  backupId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  siteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Website',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Backup = mongoose.model('Backup', backupSchema);

module.exports = Backup;
