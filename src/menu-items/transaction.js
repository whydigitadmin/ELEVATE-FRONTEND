// assets
import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const transaction = {
  id: 'transaction',
  title: 'Transaction',
  //   caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'transaction',
      title: 'Transaction',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'clientTB',
          title: 'ClientTB',
          type: 'item',
          url: '/transaction/clientTB'
        }
      ]
    }
  ]
};

export default transaction;
