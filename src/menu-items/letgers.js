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
const letgers = {
    id: 'letgers',
    title: 'Letgers',
    //   caption: 'Pages Caption',
    type: 'group',
    children: [
      {
        id: 'letgers',
        title: 'Letgers',
        type: 'collapse',
        icon: icons.IconCopyright,
  
        children: [
          {
            id: 'elevateLetgers',
            title: 'Elevate Letgers',
            type: 'item',
            url: '/letgers/elevateLetgers',
            icon: icons1.IconSquareRoundedPlus
          },
          {
            id: 'clientLetgers',
            title: 'Client Letgers',
            type: 'item',
            url: '/letgers/clientLetgers',
            icon: icons1.IconSquareRoundedPlus
          },
          {
            id: 'letgersMapping',
            title: 'Letgers Mapping',
            type: 'item',
            url: '/letgers/letgersMapping',
            icon: icons1.IconSquareRoundedPlus
          },
        ]
      }
    ]
  };

export default letgers;


