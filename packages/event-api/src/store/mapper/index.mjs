import ev from './event.mjs';
import group from './group.mjs';

export default store => {
  ev(store);
  group(store);
};
