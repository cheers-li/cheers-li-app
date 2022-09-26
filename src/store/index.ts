import { createStore } from 'state-pool';

const store = createStore();
store.setState('theme', 'light');
store.setState('sessionTags', []);

export default store;
