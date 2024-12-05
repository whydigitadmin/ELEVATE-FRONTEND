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
    title: 'Ledgers',
    //   caption: 'Pages Caption',
    type: 'group',
    children: [
      {
        id: 'ledgers',
        title: 'Ledgers',
        type: 'collapse',
        icon: icons.IconCopyright,
  
        children: [
          {
            id: 'elevateLedgers',
            title: 'Elevate Ledgers',
            type: 'item',
            url: '/ledgers/elevateLedgers',
            icon: icons1.IconSquareRoundedPlus
          },
          {
            id: 'clientLedgers',
            title: 'Client Ledgers',
            type: 'item',
            url: '/ledgers/clientLedgers',
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


