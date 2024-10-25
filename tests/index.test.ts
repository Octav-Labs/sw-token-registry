// src/index.test.ts

import { foo } from '../src/index';

describe('Constants', () => {
  test('foo sould be bar', () => {
    expect(foo).toBe('bar');
  });
});
