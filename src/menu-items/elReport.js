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
const elReport = {
    id: 'elReport',
    title: 'EL Report', 
    //   caption: 'Pages Caption',
    type: 'group',
    children: [
      {
        id: 'elReport',
        title: 'EL Report', 
        type: 'collapse',
        icon: icons.IconCopyright,
  
        children: [
          {
            id: 'demoReport',
            title: 'Demo Report',
            type: 'item',
            url: '/demoReport/elDemoReport',
            icon: icons1.IconSquareRoundedPlus
          },
        ]
      }
    ]
  };

export default elReport;


