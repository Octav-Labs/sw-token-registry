import axios from 'axios';

const foo = 'bar';
function baz() {
  return axios.get('');
}

export { foo, baz };

export { TokenRegistry } from './TokenRegistry.js';
