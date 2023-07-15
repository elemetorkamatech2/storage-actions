import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const websiteSchema = new mongoose.Schema({
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
    enum: ['pending', 'ready_to_use', 'start', 'stop', 'going_to_be_deleted', 'deleted', 'backup', 'not active','About to be restored'],
    default: 'no_status',
  },
  backups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Backup',
  }],
  maxBackups: {
    type: Number,
    default: process.env.MAX_BACKUPS,
  },
  userId: {
    type: String,
    required: true,
  },
  ImportantMessages: {
    type: String,
  },

});
const Website = mongoose.model('websiteModel', websiteSchema);
export default Website;
