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

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const Elevate = {
  id: 'Elevate',
  title: 'Elevate',
  //   caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'Elevate',
      title: 'Elevate',
      type: 'collapse',
      icon: icons.IconCopyright,

      children: [
        {
          id: 'FirstData',
          title: 'FirstData',
          type: 'item',
          url: '/FirstData',
          icon: icons1.IconSquareRoundedPlus
        },
        {
          id: 'CreateClient',
          title: 'Create Client',
          type: 'item',
          url: '/CreateClient',
          icon: icons1.IconSquareRoundedPlus
        }
      ]
    }
  ]
};

export default Elevate;