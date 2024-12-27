// assets
import { IconSquareRoundedPlus } from '@tabler/icons-react';

import { IconDatabaseStar } from '@tabler/icons-react';

import { IconMenuDeep } from '@tabler/icons-react';

// constant
const icons = {
  IconMenuDeep
};

const icons1 = {
  IconSquareRoundedPlus
};
const icons2 = {
  IconDatabaseStar
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //
const ledgers = {
  id: 'ledgers',
  title: 'Business Master',
  //   caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'ledgers',
      title: 'Business Master',
      type: 'collapse',
      icon: icons2.IconDatabaseStar,

      children: [
        {
          id: 'elevateLedgers',
          title: 'COA',
          type: 'item',
          url: '/ledgers/CoA',
          icon: icons.IconMenuDeep
        },
        {
          id: 'clientCOA',
          title: 'Client COA',
          type: 'item',
          url: '/ledgers/ClientCOA',
          icon: icons.IconMenuDeep
        },
        {
          id: 'ledgersMapping',
          title: 'Ledgers Mapping',
          type: 'item',
          url: '/ledgers/ledgersMapping',
          icon: icons.IconMenuDeep
        }
      ]
    }
  ]
};

export default ledgers;
