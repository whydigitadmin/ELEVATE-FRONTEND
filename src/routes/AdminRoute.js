import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// login option 3 routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const UserCreation = Loadable(lazy(() => import('views/admin/user-creation/UserCreation')));
const CreateClientUser = Loadable(lazy(() => import('views/admin/user-creation/CreateClientUser')));


// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AdminRoute = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: '/admin/user-creation/UserCreation',
      element: <UserCreation />
    },
     {
      path: '/admin/user-creation/CreateClientUser',
      element: <CreateClientUser />
    }
  ]
};

export default AdminRoute;