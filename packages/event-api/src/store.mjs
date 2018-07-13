import jsData from 'js-data';
import adapter from './store/adapter/sql.mjs';
import mappers from './store/mapper/index.mjs';

// create store
const store = new jsData.Container();

// register adapter
store.registerAdapter('sql', adapter, { default: true });

// register mappers
mappers(store);

export default store;
