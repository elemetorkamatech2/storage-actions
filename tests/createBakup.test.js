/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable no-undef */
const { createBackup } = require('../api/services/backup.service');
const { findById } = require('../api/models/websiteModel');
const Website = require('../api/models/websiteModel');
const Backup = require('../api/models/backupModel');

jest.mock('../api/models/websiteModel');
jest.mock('../api/models/backupModel');

describe('createBackup', () => {
  const req = { params: { id: '123' } };
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  const websiteToBackup = {
    id: '123',
    backups: [],
    description: 'Test website',
    toObject: jest.fn().mockReturnValue({
      id: '123',
      backups: [],
      description: 'Test website',
      status: 'backup',
    }),
    save: jest.fn(),
  };
  const backup = {
    id: '456',
    siteId: '123',
    description: 'Test website',
    save: jest.fn(),
  };

  beforeEach(() => {
    findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(websiteToBackup) });
    Website.mockImplementation(() => websiteToBackup);
    Backup.mockImplementation(() => backup);
    res.status.mockClear();
    res.send.mockClear();
    websiteToBackup.toObject.mockClear();
    websiteToBackup.save.mockClear();
    backup.save.mockClear();
  });

  it('should return 404 if website is not found', async () => {
    findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
    await createBackup(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('Website not found!');
  });

  it('should return 404 if website is already backed up', async () => {
    websiteToBackup.backups = [backup];
    await createBackup(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('This website is already backed up');
  });
  it('should create backup successfully', async () => {
    const arr = [];
    websiteToBackup.backups = arr;
    await createBackup(req, res);
    expect(findById).toHaveBeenCalledWith('123');
    expect(websiteToBackup.save).toHaveBeenCalled();
    expect(Backup).toHaveBeenCalledWith({
      siteId: '123',
      description: 'Test website',
    });
    expect(backup.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('Backup created successfully');
  });

  it('should return 500 if an error occurs', async () => {
    const errorMessage = 'Test error';
    findById.mockReturnValue({ exec: jest.fn().mockRejectedValue(new Error(errorMessage)) });
    await createBackup(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ error: errorMessage });
  });
});
