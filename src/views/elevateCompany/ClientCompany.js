import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';
import { FormControl, FormHelperText, InputLabel, Autocomplete, MenuItem, Select } from '@mui/material';
import { encryptPassword } from 'views/utilities/encryptPassword';

const ClientCompany = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [editId, setEditId] = useState('');
  const [allcompanyCode, setAllcompanyCode] = useState([]);
  const [formData, setFormData] = useState({
    companyCode: '',
    clientCode: '',
    clientName: '',
    email: '',
    phone: '',
    webSite: '',
    active: true
  });

  const [fieldErrors, setFieldErrors] = useState({
    companyCode: '',
    clientCode: '',
    clientName: '',
    email: '',
    phone: '',
    webSite: '',
    active: ''
  });
  const [listView, setListView] = useState(false);
  const listViewColumns = [
    { accessorKey: 'clientCode', header: 'Company Code', size: 140 },
    { accessorKey: 'companyCode', header: 'Company Name', size: 140 },
    {
      accessorKey: 'clientName',
      header: 'Company',
      size: 140
    },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const [listViewData, setListViewData] = useState([]);

  useEffect(() => {
    getAllClientCompany();
    getAllcompanyCode();
  }, []);
  const getAllClientCompany = async () => {
    try {
      const response = await apiCalls('get', `clientcompanycontroller/getClientCompanyByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.clientCompanyVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getClientCompanyById = async (row) => {
    console.log('THE SELECTED COMPANY ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `clientcompanycontroller/getClientCompanyById?id=${orgId}`);
      console.log('API Response get by Id:', response.paramObjectsMap.clientCompanyVO);

      if (response.status === true) {
        setListView(false);
        const particularClientCompany = response.paramObjectsMap.clientCompanyVO;
        console.log('THE PARTICULAR COMPANY DETAILS ARE:', particularClientCompany);

        setFormData({
          clientCode: particularClientCompany.clientCode,
          companyCode: particularClientCompany.companyCode,
          clientName: particularClientCompany.clientName,
          email: particularClientCompany.email,
          phone: particularClientCompany.phone,
          webSite: particularClientCompany.webSite,
          active: particularClientCompany.active === 'Active' ? true : false
        });
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllcompanyCode = async () => {
    try {
      const response = await apiCalls('get', `companycontroller/getAllEltCompany`);
      console.log('API Response of Company Code:', response);

      if (response.status === true) {
        const activeCompanies = response.paramObjectsMap.eltCompanyVOs
          .filter((row) => row.active === 'Active')
          .map(({ id, companyCode }) => ({
            id,
            // countryName: companyName,
            companyCode: companyCode
          }));
        setAllcompanyCode(activeCompanies);

        console.log('Filtered Active Companies:', activeCompanies);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;
    const nameRegex = /^[A-Za-z ]*$/;
    const phoneNumberRegex = /^[0-9]*$/;
    const clientNameRegex = /^[A-Za-z 0-9@_\-*]*$/;
    const clientCodeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;

    if (name === 'clientName' && !clientNameRegex.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
    } else if (name === 'clientCode' && !clientCodeRegex.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
    } 
  //   else if (name === 'phone') {
  //     if (!phoneNumberRegex.test(value)) {
  //         setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
  //         return;
  //     }
  //     if (value.length > 10) {
  //         setFieldErrors({ ...fieldErrors, [name]: 'Phone number cannot exceed 10 digits' });
  //         return;
  //     } else if (value.length < 10 && value.length > 0) {
  //         setFieldErrors({ ...fieldErrors, [name]: 'Phone number must be 10 digits' });
  //     } else {
  //         setFieldErrors({ ...fieldErrors, [name]: '' });
  //     }
  // } 
    else if (name === 'phone' && !phoneNumberRegex.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
    } 
    // else if (name === 'email' && !emailRegex.test(value)) {
    //   setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
    // }  
    // else if (name === 'webSite' && !websiteRegex.test(value)) {
    //   setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
    // }
     else {
      let updatedValue = value;

      if (name !== 'email' && name !== 'webSite' ) {
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
      clientCode: '',
      clientName: '',
      email: '',
      phone: '',
      webSite: '',
      active: true
    });
    setFieldErrors({
      companyCode: '',
      clientCode: '',
      clientName: '',
      email: '',
      webSite: '',
      phone: ''
    });
    setEditId('');
  };

  const handleSave = async () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.companyCode) {
      errors.companyCode = 'Company Code is required';
    }
    if (!formData.clientCode) {
      errors.clientCode = 'Client Code is required';
    }
    if (!formData.clientName) {
      errors.clientName = 'Client Name is required';
    }
    if (!formData.webSite) {
      errors.webSite = 'Website is required';
    }
    if (!formData.phone) {
      errors.phone = 'Phone is required';
    }
    if (!formData.email) {
      errors.email = 'Email ID is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid MailID Format';
    }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        // address: '',
        // city: '',
        // ceo: '',
        // country: '',
        // currency: '',
        // mainCurrency: '',
        // note: '',
        // state: '',
        // gst: '',
        // webSite: '',
        // zip: '',
        companyCode: formData.companyCode,
        clientCode: formData.clientCode,
        clientName: formData.clientName,
        createdBy: loginUserName,
        email: formData.email,
        // password: encryptPassword('Wds@2022'),
        phone: formData.phone,
        webSite: formData.webSite,
        orgId: orgId
      };
      console.log('DATA TO SAVE IS:', saveFormData);

      try {
        const response = await apiCalls('put', `clientcompanycontroller/updateCreateClientCompany`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Client Company Updated Successfully' : 'Client Company Created successfully');
          getAllClientCompany();
          handleClear();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.message || 'Client Company creation failed');
        }
      } catch (error) {
        // try {
        //   // const method = editId ? 'put' : 'post';
        //   // const url = editId ? '/clientcompanycontroller/updateCreateClientCompany' : '/clientcompanycontroller/updateCreateClientCompany';

        //   // const response = await apiCalls(method, url, saveData);
        //   // const response = await apiCalls('put',  `clientcompanycontroller/updateCreateClientCompany', saveFormData);

        //   if (response.status === true) {
        //     console.log('Response:', response);
        //     showToast('success', editId ? 'Client Company Updated Successfully' : 'Client Company created successfully');

        //     handleClear();
        //     getAllClientCompany();
        //     setIsLoading(false);
        //   } else {
        //     showToast('error', response.paramObjectsMap.message || 'Client Company creation failed');
        //     setIsLoading(false);
        //   }
        // }
        console.error('Error:', error);
        showToast('error', 'Client Company creation failed');

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
              toEdit={getClientCompanyById}
            />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <Autocomplete
                  options={allcompanyCode}
                  getOptionLabel={(option) => option.companyCode || ''}
                  groupBy={(option) => (option.companyCode ? option.companyCode[0].toUpperCase() : '')}
                  value={formData.companyCode ? allcompanyCode.find((a) => a.companyCode === formData.companyCode) || null : null}
                  onChange={(event, newValue) => {
                    const value = newValue ? newValue.companyCode : '';
                    setFormData((prev) => ({ ...prev, companyCode: value }));
                  }}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Company Code"
                      variant="outlined"
                      error={!!fieldErrors.companyCode}
                      helperText={fieldErrors.companyCode || ''}
                    />
                  )}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Code"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="clientCode"
                  value={formData.clientCode}
                  onChange={handleInputChange}
                  error={!!fieldErrors.clientCode}
                  helperText={fieldErrors.clientCode}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  error={!!fieldErrors.clientName}
                  helperText={fieldErrors.clientName}
                  // inputRef={clientNameRef}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Email"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Website"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="webSite"
                  value={formData.webSite}
                  onChange={handleInputChange}
                  error={!!fieldErrors.webSite}
                  helperText={fieldErrors.webSite}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Phone"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 10 }}
                  error={!!fieldErrors.phone}
                  helperText={fieldErrors.phone}
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
export default ClientCompany;
