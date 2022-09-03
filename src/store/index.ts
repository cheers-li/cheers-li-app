import { createStore } from 'state-pool';

const store = createStore();
store.setState('menuOpen', false);

export default store;
