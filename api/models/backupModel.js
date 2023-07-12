import mongoose from 'mongoose';

const backupSchema = new mongoose.Schema(
  {
    siteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Website',
      required: true,
    },
    backupSiteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Website',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  // timestamps: {
  //   createdAt: 'created_at',
  //   updatedAt: 'updated_at',
  // },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

const Backup = mongoose.model('Backup', backupSchema);

export default Backup;
