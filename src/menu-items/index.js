
import basicMaster from './basicMaster';
import companySetup from './companySetup';
import dashboard from './dashboard';
import finance from './finance';
import RolesAndResponsibilities from './RolesAndResponsibilities';
import eltCompany from './eltCompany';
import Ledgers from './ledgers';

// Function to get menu items based on localStorage value
const getMenuItems = () => {
  const localStorageValue = 'ROLE_ADMIN'; // Replace 'your_key_here' with the key you are using to store the value

  // Define default menu items
  const defaultMenuItems = {
    items: [dashboard, basicMaster, finance, eltCompany,Ledgers]
  };

  // Define menu items based on localStorage value
  switch (localStorageValue) {
    case 'ROLE_SUPER_ADMIN':
      return {
        items: [dashboard, companySetup, basicMaster,eltCompany,Ledgers]
      };
    case 'ROLE_ADMIN':
      return {
        items: [dashboard, companySetup, RolesAndResponsibilities, basicMaster, finance, eltCompany,Ledgers]
      };
    // Add more cases as needed
    default:
      return defaultMenuItems; // Return default menu items if no match found
  }
};

// Export default menu items
export default getMenuItems();