import * as migration_20261125_213432_initial from './20261125_213432_initial';
import * as migration_20261126_160533_projet_details from './20261126_160533_projet_details';
import * as migration_20261126_161652_video_traduite from './20261126_161652_video_traduite';
import * as migration_20261126_165919_mention_vignette from './20261126_165919_mention_vignette';

export const migrations = [
  {
    up: migration_20261125_213432_initial.up,
    down: migration_20261125_213432_initial.down,
    name: '20261125_213432_initial',
  },
  {
    up: migration_20261126_160533_projet_details.up,
    down: migration_20261126_160533_projet_details.down,
    name: '20261126_160533_projet_details',
  },
  {
    up: migration_20261126_161652_video_traduite.up,
    down: migration_20261126_161652_video_traduite.down,
    name: '20261126_161652_video_traduite',
  },
  {
    up: migration_20261126_165919_mention_vignette.up,
    down: migration_20261126_165919_mention_vignette.down,
    name: '20261126_165919_mention_vignette'
  },
];
