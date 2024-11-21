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

const CompanyEmploye = {
  id: 'CompanyEmploye',
  title: 'Company Employe',
  //   caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'CompanyEmploye',
      title: 'Company Employe',
      type: 'collapse',
      icon: icons.IconCopyright,

      children: [
        {
          id: 'CreateCompanyEmploye',
          title: 'Create Company Employe',
          type: 'item',
          url: '/CompanyEmploye/CreateCompanyEmploye',
          icon: icons1.IconSquareRoundedPlus
        }
      ]
    }
  ]
};

export default CompanyEmploye;