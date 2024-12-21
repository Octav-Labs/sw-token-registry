import { isUri } from '../src/helpers/isUri';

describe('isUri', () => {
  it('sould be an uri', async () => {
    expect(isUri('https://domain.com')).toBeTruthy();
  });

  it('sould not be an uri', async () => {
    expect(isUri('domain.com')).toBeFalsy();
  });
});
