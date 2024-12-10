// assets
import { IconKey } from '@tabler/icons-react';
import { IconCopyright } from '@tabler/icons-react';
import { IconSettingsPlus, IconSquareRoundedPlus } from '@tabler/icons-react';

// constant
const icons = {
  IconCopyright
};

const icons1 = {
  IconSquareRoundedPlus
};
const icons2 = {
  IconSettingsPlus
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
        icon: icons.IconCopyright,
  
        children: [
          {
            id: 'elevateLedgers',
            title: 'COA',
            type: 'item',
            url: '/ledgers/CoA',
            icon: icons1.IconSquareRoundedPlus
          },
          {
            id: 'clientCOA',
            title: 'Client COA',
            type: 'item',
            url: '/ledgers/ClientCOA',
            icon: icons1.IconSquareRoundedPlus
          },
          {
            id: 'ledgersMapping',
            title: 'Ledgers Mapping',
            type: 'item',
            url: '/ledgers/ledgersMapping',
            icon: icons1.IconSquareRoundedPlus
          },
        ]
      }
    ]
  };

export default ledgers;


