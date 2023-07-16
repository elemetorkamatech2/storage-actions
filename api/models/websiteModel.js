import mongoose from 'mongoose';
import { websiteStatuses, collectionNames } from '../../enums.js';

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
    enum: websiteStatuses,
    default: websiteStatuses.NO_STATUS,
  },
  backups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionNames.Backup,
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
const Website = mongoose.model(collectionNames.Website, websiteSchema);
export default Website;
