import { createStore } from 'state-pool';

const store = createStore();
store.setState('menuOpen', false);
store.setState('theme', 'light');

export default store;
