import ap from './ap';
import ar from './ar';
import basicMaster from './basicMaster';
import companySetup from './companySetup';
import dashboard from './dashboard';
import finance from './finance';
import RolesAndResponsibilities from './RolesAndResponsibilities';
import transaction from './transaction';
import eltCompany from './eltCompany';
import Letgers from './letgers';

// Function to get menu items based on localStorage value
const getMenuItems = () => {
  const localStorageValue = 'ROLE_ADMIN'; // Replace 'your_key_here' with the key you are using to store the value

  // Define default menu items
  const defaultMenuItems = {
    items: [dashboard, basicMaster, finance, transaction, ar, ap, eltCompany,Letgers]
  };

  // Define menu items based on localStorage value
  switch (localStorageValue) {
    case 'ROLE_SUPER_ADMIN':
      return {
        items: [dashboard, companySetup, basicMaster,eltCompany,Letgers]
      };
    case 'ROLE_ADMIN':
      return {
        items: [dashboard, companySetup, RolesAndResponsibilities, basicMaster, finance, transaction, ar, ap, eltCompany,Letgers]
      };
    // Add more cases as needed
    default:
      return defaultMenuItems; // Return default menu items if no match found
  }
};

// Export default menu items
export default getMenuItems();