import admin from './admin';
import ap from './ap';
import ar from './ar';
import basicMaster from './basicMaster';
import companySetup from './companySetup';
import dashboard from './dashboard';
import finance from './finance';
import RolesAndResponsibilities from './RolesAndResponsibilities';
import transaction from './transaction';
import Elevate from './Elevate';
import CompanyEmploye from './CompanyEmploye';
import eltCompany from './eltCompany';


// Function to get menu items based on localStorage value
const getMenuItems = () => {
  const localStorageValue = 'ROLE_ADMIN'; // Replace 'your_key_here' with the key you are using to store the value

  // Define default menu items
  const defaultMenuItems = {
    items: [dashboard, admin, basicMaster, finance, transaction, ar, ap,Elevate,CompanyEmploye,eltCompany]
  };

  // Define menu items based on localStorage value
  switch (localStorageValue) {
    case 'ROLE_SUPER_ADMIN':
      return {
        items: [dashboard, companySetup, basicMaster,eltCompany]
      };
    case 'ROLE_ADMIN':
      return {
        items: [dashboard, companySetup, admin, RolesAndResponsibilities, basicMaster, finance, transaction, ar, ap,eltCompany]
      };
    // Add more cases as needed
    default:
      return defaultMenuItems; // Return default menu items if no match found
  }
};

// Export default menu items
export default getMenuItems();