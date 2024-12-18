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

// const companySetup = {
//   id: 'basicMaster',
//   title: 'Setup',
//   //   caption: 'Pages Caption',
//   type: 'group',
//   children: [
//     {
//       id: 'company',
//       title: 'Company',
//       type: 'item',
//       url: '/company',
//       icon: icons.IconDashboard,
//       breadcrumbs: false
//     }
//   ]
// };

const companySetup = {
  id: 'companySetup',
  title: 'Company Setup',
  //   caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'companySetup',
      title: 'Company Setup',
      type: 'collapse',
      icon: icons.IconCopyright,

      children: [
        {
          id: 'createCompany',
          title: 'Create Company',
          type: 'item',
          url: '/companysetup/createcompany',
          icon: icons1.IconSquareRoundedPlus
        },
        {
          id: 'company',
          title: 'Company Setup',
          type: 'item',
          url: '/companysetup/Company',
          icon: icons2.IconSettingsPlus
        },
        {
          id: 'branch',
          title: 'Branch',
          type: 'item',
          url: '/companysetup/branch',
          icon: icons1.IconSquareRoundedPlus
        }
      ]
    }
  ]
};

export default companySetup;
