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
const eltCompany = {
    id: 'elevateCompany',
    title: 'Elevate',
    //   caption: 'Pages Caption',
    type: 'group',
    children: [
      {
        id: 'elevateCompany',
        title: 'Elevate',
        type: 'collapse',
        icon: icons.IconCopyright,
  
        children: [
          {
            id: 'eltCompany',
            title: 'Company',
            type: 'item',
            url: '/elevateCompany/eltCompany',
            icon: icons1.IconSquareRoundedPlus
          },
          {
            id: 'clientCompany',
            title: 'Client',
            type: 'item',
            url: '/elevateCompany/clientCompany',
            icon: icons1.IconSquareRoundedPlus
          },
          {
            id: 'createCompanyEmployee',
            title: 'Company Employee',
            type: 'item',
            url: '/elevateCompany/createCompanyEmployee',
            icon: icons1.IconSquareRoundedPlus
          },
          {
            id: 'createClient',
            title: 'Client Employee',
            type: 'item',
            url: '/elevateCompany/createClient',
            icon: icons1.IconSquareRoundedPlus
          }
          
        ]
      }
    ]
  };

export default eltCompany;


