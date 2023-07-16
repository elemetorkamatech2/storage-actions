import wwb from '../api/services/website.service';

describe('publishChangeStatus', () => {
  it('should return an error if the website is not found', async () => {
    const result = await publishChangeStatus(1);
    expect(result).toEqual({ error: 'Website doesnt found' });
  });

  it('should change the status of the website to "about to be start" if the current status is "stop"', async () => {
    const website = {
      id: 1,
      status: 'stop',
    };
    const result = await publishChangeStatus(website.id);
    expect(result).toEqual({
      success: true,
      message: 'seccuss change status to about to be start',
    });
    expect(website.status).toEqual('about to be start');
  });

  it('should change the status of the website to "about to be stop" if the current status is "start"', async () => {
    const website = {
      id: 1,
      status: 'start',
    };
    const result = await publishChangeStatus(website.id);
    expect(result).toEqual({
      success: true,
      message: 'seccuss change status to about to be stop',
    });
    expect(website.status).toEqual('about to be stop');
  });

  it('should return an error if the website is already in the desired status', async () => {
    const website = {
      id: 1,
      status: 'stop',
    };
    const result = await publishChangeStatus(website.id);
    expect(result).toEqual({ error: 'This website is already stop' });
  });
});
