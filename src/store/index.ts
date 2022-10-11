import { createStore } from 'state-pool';

const store = createStore();
store.setState('dark', false);
store.setState('sessionTags', []);
store.setState('user', null);
store.setState('friendRequests', []);

export default store;
