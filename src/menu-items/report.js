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
  id: 'report',
  title: 'Report',
  //   caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'report',
      title: 'Report',
      type: 'collapse',
      icon: icons.IconCopyright,

      children: [
        {
          id: 'clientTBReport',
          title: 'COA Ledger',
          type: 'item',
          url: '/report/clientTBReport',
          icon: icons1.IconSquareRoundedPlus
        },
        {
          id: 'elTBReport',
          title: 'EL TB-Report',
          type: 'item',
          url: '/report/elTBReport',
          icon: icons1.IconSquareRoundedPlus
        },
        {
          id: 'demoReport',
          title: 'Sales Report',
          type: 'item',
          url: '/report/salesReport',
          icon: icons1.IconSquareRoundedPlus
        },
      ]
    }
  ]
};

export default ledgers;


