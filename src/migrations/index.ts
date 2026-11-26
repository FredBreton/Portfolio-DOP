import * as migration_20261125_213432_initial from './20261125_213432_initial';
import * as migration_20261126_160533_projet_details from './20261126_160533_projet_details';

export const migrations = [
  {
    up: migration_20261125_213432_initial.up,
    down: migration_20261125_213432_initial.down,
    name: '20261125_213432_initial',
  },
  {
    up: migration_20261126_160533_projet_details.up,
    down: migration_20261126_160533_projet_details.down,
    name: '20261126_160533_projet_details'
  },
];
