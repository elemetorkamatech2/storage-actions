/* eslint-disable max-len */
/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
import backupService from '../api/services/backup.service.js';
import Website from '../api/models/websiteModel.js';
import Backup from '../api/models/backupModel.js';

jest.mock('../api/models/websiteModel');
jest.mock('../api/models/backupModel');
describe('createBackup', () => {
  const websiteToBackup = {
    id: '649877bde1dd83dca315bc63',
    backups: [],
    description: 'Test website',
    toObject: jest.fn().mockReturnValue({
      id: '649877bde1dd83dca315bc63',
      backups: [],
      description: 'Test website',
      status: 'backup',
      ImportantMessages: 'null',
    }),
    save: jest.fn(),
  };
  const backup = {
    id: '648994bf5f53d2c92ffeba89',
    siteId: '649877bde1dd83dca315bc63',
    description: 'Test website',
    save: jest.fn(),
  };
  beforeEach(() => {
    Website.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(websiteToBackup) });
    Website.mockImplementation(() => websiteToBackup);
    Backup.mockImplementation(() => backup);
    websiteToBackup.toObject.mockClear();
    websiteToBackup.save.mockClear();
    backup.save.mockClear();
  });
  it('should create backup successfully and return { success: true, message: "Backup created successfully" }', async () => {
    websiteToBackup.save = jest.fn();
    const result = await backupService.createBackup('649877bde1dd83dca315bc63');
    expect(Website.findById).toHaveBeenCalledWith('649877bde1dd83dca315bc63');
    expect(websiteToBackup.save).toHaveBeenCalled();
    expect(Backup).toHaveBeenCalledWith({
      siteId: '649877bde1dd83dca315bc63',
      description: 'Test website',
    });
    expect(backup.save).toHaveBeenCalled();
    expect(websiteToBackup.backups).toEqual([backup]);
    expect(result).toEqual({ success: true, message: 'Backup created successfully' });
  });

  it('should return { success: false, message: "Website not found" } if website is not found', async () => {
    Website.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
    const result = await backupService.createBackup('649877bde1dd83dca315bc63');
    expect(result).toEqual({ success: false, message: 'Website not found' });
  });

  it('should return { success: false, message: "This website is already backed up" } if website is already backed up', async () => {
    websiteToBackup.backups = [backup];
    const result = await backupService.createBackup('649877bde1dd83dca315bc63');
    expect(result).toEqual({ success: false, message: 'This website is already backed up' });
  });
  it('should return { success: false, message: "Test error" } if an error occurs', async () => {
    const errorMessage = 'Test error';
    Website.findById.mockReturnValue({ exec: jest.fn().mockRejectedValue(new Error(errorMessage)) });
    const result = await backupService.createBackup('649877bde1dd83dca315bc63');
    expect(result).toEqual({ success: false, message: errorMessage });
  });
});
