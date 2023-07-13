import mongoose from 'mongoose';
import { collectionNames } from '../../enums.js';

const backupSchema = new mongoose.Schema(
  {
    siteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collectionNames.Website,
      required: true,
    },
    backupSiteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collectionNames.Website,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

const Backup = mongoose.model(collectionNames.Backup, backupSchema);

export default Backup;
