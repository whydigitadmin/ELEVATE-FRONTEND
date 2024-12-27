// assets
import { IconCopyright, IconSettingsPlus, IconSquareRoundedPlus } from '@tabler/icons-react';

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
          title: 'EL - MFR',
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
        {
          id: 'mismatchDb',
          title: 'Mismatch TB',
          type: 'item',
          url: '/report/mismatchDB',
          icon: icons1.IconSquareRoundedPlus
        }
      ]
    }
  ]
};

export default ledgers;
