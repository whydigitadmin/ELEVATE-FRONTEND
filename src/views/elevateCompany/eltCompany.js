import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import apiCalls from 'apicall';
import eltCompany from 'menu-items/eltCompany';
import { useEffect, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';
import { encryptPassword } from 'views/utilities/encryptPassword';

const EltCompany = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [editId, setEditId] = useState('');
  const [formData, setFormData] = useState({
    companyCode: '',
    companyName: '',
    phoneNo: '',
    companyEmail: '',
    website: '',
    active: true
  });

  const [fieldErrors, setFieldErrors] = useState({
    companyCode: '',
    companyName: '',
    phoneNo: '',
    companyEmail: '',
    website: '',
    active: ''
  });
  const [listView, setListView] = useState(false);
  const listViewColumns = [
    { accessorKey: 'companyCode', header: 'Company Code', size: 140 },
    {
      accessorKey: 'companyName',
      header: 'Company',
      size: 140
    },
    {
      accessorKey: 'companyMail',
      header: 'companyMail',
      size: 140
    },
    {
      accessorKey: 'phoneNo',
      header: 'phoneNo',
      size: 140
    },
    {
      accessorKey: 'website',
      header: 'Website',
      size: 140
    },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const [listViewData, setListViewData] = useState([]);

  useEffect(() => {
    // getAllCompanies();
  }, []);
  const getAllCompanies = async () => {
    try {
      const response = await apiCalls('get', `commonmaster/company`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.companyVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const getCompanyById = async (row) => {
    console.log('THE SELECTED COMPANY ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `commonmaster/company/${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularCompany = response.paramObjectsMap.companyVO[0];
        console.log('THE PARTICULAR COMPANY DETAILS ARE:', particularCompany);

        setFormData({
          companyCode: particularCompany.companyCode,
          companyName: particularCompany.companyName,
          phoneNo: particularCompany.phoneNo,
          companyEmail: particularCompany.email,
          website: particularCompany.website,
          active: particularCompany.active === 'Active' ? true : false
        });
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;
  
    // Regex Patterns
    const nameRegex = /^[A-Za-z ]*$/;
    const companyNameRegex = /^[A-Za-z 0-9@_\-*]*$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const companyCodeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;
    const phoneNumberRegex = /^[0-9]*$/; // Only numbers allowed
  
    if (name === 'companyName' && !companyNameRegex.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Only alphabetic characters and @*_- are allowed' });
    } else if (name === 'companyCode' && !companyCodeRegex.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
    } else if (name === 'phoneNo' && !phoneNumberRegex.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Only numeric values are allowed' });
    } else {
      let updatedValue = value;
  
      // Enforce lowercase for email fields
      if (name === 'companyEmail') {
        updatedValue = value.toLowerCase();
      } 
      // Ensure phoneNo is numeric only
      else if (name === 'phoneNo') {
        updatedValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
      } 
      // Convert other fields to uppercase
      else {
        updatedValue = value.toUpperCase();
      }
  
      if (type === 'checkbox') {
        setFormData({ ...formData, [name]: checked });
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: updatedValue
        }));
      }
  
      setFieldErrors({ ...fieldErrors, [name]: '' });
  
      // Update the cursor position after the input change only for text inputs
      if (type === 'text' || type === 'email' || type === 'textarea') {
        setTimeout(() => {
          const inputElement = document.getElementsByName(name)[0];
          inputElement.setSelectionRange(selectionStart, selectionEnd);
        }, 0);
      }
    }
  };
  

  const handleClear = () => {
    setFormData({
      companyCode: '',
      companyName: '',
      phoneNo: '',
      companyEmail: '',
      website: '',
      active: true
    });
    setFieldErrors({
      companyCode: '',
      companyName: '',
      phoneNo: '',
      companyEmail: '',
      website:''
    });
    setEditId('');
  };

  const handleSave = async () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.companyCode) {
      errors.companyCode = 'Company Code is required';
    }
    if (!formData.companyName) {
      errors.companyName = 'Company is required';
    }
    if (!formData.phoneNo) {
      errors.phoneNo = 'Phone Number is required';
    }
    if (!formData.website) {
      errors.website = 'website is required';
    }
    if (!formData.companyEmail) {
      errors.companyEmail = 'company Admin Email ID is required';
    } else if (!emailRegex.test(formData.companyEmail)) {
      errors.companyEmail = 'Invalid MailID Format';
    }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

      const saveData = {
        ...(editId && { id: editId }),
        active: formData.active,
        companyCode: formData.companyCode,
        companyName: formData.companyName,
        createdBy: loginUserName,
        email: formData.companyEmail,
        phoneNo: formData.phoneNo,
        website: formData.website,
        employeeCode: formData.employeeCode,
        // orgId: orgId
      };
      console.log('DATA TO SAVE IS:', saveData);

      try {
        const method = editId ? 'put' : 'post';
        const url = editId ? 'commonmaster/updateCompany' : 'companycontroller/updateCreateCompany';

        const response = await apiCalls(method, url, saveData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? ' Company Updated Successfully' : 'Company created successfully');

          handleClear();
          // getAllCompanies();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Company creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Company creation failed');

        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleView = () => {
    setListView(!listView);
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} margin="0 10px 0 10px" />
          </div>
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable
              data={listViewData}
              columns={listViewColumns}
              // editCallback={editEmployee}
              blockEdit={true} // DISAPLE THE MODAL IF TRUE
              toEdit={getCompanyById}
            />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <TextField
                  label="Company Code"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="companyCode"
                  value={formData.companyCode}
                  onChange={handleInputChange}
                  error={!!fieldErrors.companyCode}
                  helperText={fieldErrors.companyCode}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Company Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  error={!!fieldErrors.companyName}
                  helperText={fieldErrors.companyName}
                // inputRef={companyNameRef}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Company Email Id"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleInputChange}
                  error={!!fieldErrors.companyEmail}
                  helperText={fieldErrors.companyEmail}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Website"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="Website"
                  value={formData.website}
                  onChange={handleInputChange}
                  error={!!fieldErrors.website}
                  helperText={fieldErrors.website}
                />
              </div>
              
              <div className="col-md-3 mb-3">
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleInputChange}
                  error={!!fieldErrors.phoneNo}
                  helperText={fieldErrors.phoneNo}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={formData.active} onChange={handleInputChange} name="active" />}
                  label="Active"
                />
              </div>
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default EltCompany;
