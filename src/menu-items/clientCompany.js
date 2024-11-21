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
const clientCompany = {
    id: 'clientCompany',
    title: 'Client Company',
    type: 'group',
    children: [
      {
        id: 'clientCompany',
        title: 'Client Company',
        type: 'collapse',
        icon: icons.IconCopyright,
  
        children: [
          {
            id: 'clientCompany',
            title: 'Client Company',
            type: 'item',
            url: '/clientCompany/clientCompany',
            icon: icons1.IconSquareRoundedPlus
          }
        ]
      }
    ]
  };

export default clientCompany;