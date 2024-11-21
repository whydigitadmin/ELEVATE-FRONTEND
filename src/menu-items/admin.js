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

const admin = {
  id: 'admin',
  title: 'Admin',
  type: 'group',
  children: [
    {
      id: 'admin',
      title: 'Admin',
      type: 'collapse',
      icon: icons.IconCopyright,
      children: [
        {
          id: 'admin',
          title: 'Company User Creation',
          type: 'item',
          url: '/admin/user-creation/userCreation',
          icon: icons1.IconSquareRoundedPlus
        },
        {
          id: 'admin',
          title: 'Client User Creation',
          type: 'item',
          url: '/admin/user-creation/CreateClientUser',
          icon: icons1.IconSquareRoundedPlus
        }
      ]
    }
  ]
};
export default admin;
