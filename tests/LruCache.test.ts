import { LRUCache } from 'lru-cache';
import { sleep } from '../src/helpers/misc';

describe('LRUCache', () => {
  it('sould work as expected', async () => {
    const cache = new LRUCache<string, number>({
      ttl: 1000,
      max: 3,
    });

    // TEST 1
    cache.set('1', 1);
    cache.set('2', 2);
    cache.set('3', 3);
    cache.set('4', 4);
    cache.set('5', 5);
    let one = cache.get('1');
    let two = cache.get('2');
    let three = cache.get('3');
    expect(one).not.toBeDefined();
    expect(two).not.toBeDefined();
    expect(three).toBeDefined();
    await sleep(1050);
    one = cache.get('1');
    two = cache.get('2');
    three = cache.get('3');
    expect(one).not.toBeDefined();
    expect(two).not.toBeDefined();
    expect(three).not.toBeDefined();

    // TEST 2
    cache.set('1', 1);
    cache.set('2', 2);
    cache.get('1');
    cache.set('3', 3);
    cache.set('4', 4);
    one = cache.get('1');
    two = cache.get('2');
    three = cache.get('3');
    expect(one).toBeDefined();
    expect(two).not.toBeDefined();
    expect(three).toBeDefined();
  });
});
