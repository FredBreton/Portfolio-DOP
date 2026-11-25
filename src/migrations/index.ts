import * as migration_20261125_213432_initial from './20261125_213432_initial';

export const migrations = [
  {
    up: migration_20261125_213432_initial.up,
    down: migration_20261125_213432_initial.down,
    name: '20261125_213432_initial'
  },
];
