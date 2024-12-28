import { getCoingeckoCoinsList } from '../../src/helpers/getCoingeckoCoinsList';

describe('getCoingeckoCoinsList', () => {
  jest.setTimeout(1200000); // Increase the timeout to handle potential network delays
  it('sould getCoingeckoCoinsList', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const list1 = await getCoingeckoCoinsList();

    const debut = performance.now();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const list2 = await getCoingeckoCoinsList();
    const fin = performance.now();
    const tempsEcoule = fin - debut;

    expect(tempsEcoule).toBeLessThan(1000);
  });
});
