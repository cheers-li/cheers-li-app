import { createStore } from 'state-pool';

const store = createStore();
store.setState('dark', false);
store.setState('sessionTags', []);
store.setState('user', null);

export default store;
