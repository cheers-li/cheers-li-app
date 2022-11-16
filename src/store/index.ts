import { createStore } from 'state-pool';

const store = createStore();
store.setState('theme', 'system');
store.setState('dark', false);
store.setState('sessionTags', []);
store.setState('user', null);
store.setState('profile', null);
store.setState('friendRequests', []);
store.setState('showMap', false);
store.setState('userPosition', []);
store.setState('zoomPosition', []);

export default store;
