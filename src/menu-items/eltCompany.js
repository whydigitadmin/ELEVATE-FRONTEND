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
    title: 'Elevate Company',
    //   caption: 'Pages Caption',
    type: 'group',
    children: [
      {
        id: 'elevateCompany',
        title: 'Elevate Company',
        type: 'collapse',
        icon: icons.IconCopyright,
  
        children: [
          {
            id: 'eltCompany',
            title: 'Elt Company',
            type: 'item',
            url: '/elevateCompany/eltCompany',
            icon: icons1.IconSquareRoundedPlus
          }
        ]
      }
    ]
  };


// const eltCompany = {
//   id: 'EltCompany',
//   title: 'Elt Company',
//   //   caption: 'Pages Caption',
//   type: 'group',
//   children: [
//     {
//       id: 'EltCompany',
//       title: 'Elt Company',
//       type: 'collapse',
//       icon: icons.IconCopyright,

//       children: [
//         {
//           id: 'EltCompany',
//           title: 'Elt Company',
//           type: 'item',
//           url: '/eltCompany/eltCompany',
//           icon: icons1.IconSquareRoundedPlus
//         },
//         {
//           id: 'company',
//           title: 'Company Setup',
//           type: 'item',
//           url: '/companysetup/companysetup',
//           icon: icons2.IconSettingsPlus
//         }
//       ]
//     }
//   ]
// };

export default eltCompany;


