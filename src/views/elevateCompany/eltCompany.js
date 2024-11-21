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

const EltCompany = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [editId, setEditId] = useState('');
  const [formData, setFormData] = useState({
    companyCode: '',
    companyName: '',
    phone: '',
    email: '',
    webSite: '',
    active: true
  });

  const [fieldErrors, setFieldErrors] = useState({
    companyCode: '',
    companyName: '',
    phone: '',
    email: '',
    Website: '',
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
      accessorKey: 'phone',
      header: 'phone Number',
      size: 140
    },
    {
      accessorKey: 'email',
      header: 'companyMail',
      size: 140
    },
    {
      accessorKey: 'webSite',
      header: 'webSite',
      size: 140
    },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];
  const [listViewData, setListViewData] = useState([]);

  useEffect(() => {
    getAllCompanies();
  }, []);
  const getAllCompanies = async () => {
    try {
      const response = await apiCalls('get', `companycontroller/getAllEltCompany`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.eltCompanyVOs);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getCompanyById = async (row) => {
    if (!row || !row.original || !row.original.id) {
      console.error('Invalid row data passed:', row);
      return;
    }

    const companyId = row.original.id;
    console.log('The selected company ID is:', companyId);
    setEditId(companyId);

    try {
      const response = await apiCalls('get', `companycontroller/getEltCompanyById?id=${companyId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularCompany = response.paramObjectsMap.eltCompanyVO;
        console.log('The particular company details are:', particularCompany);

        setFormData({
          companyCode: particularCompany.companyCode,
          companyName: particularCompany.companyName,
          phone: particularCompany.phone,
          email: particularCompany.email,
          webSite: particularCompany.webSite,
          active: particularCompany.active === 'Active',
        });
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;

    // Regular expressions
    const companyNameRegex = /^[A-Za-z 0-9@_\-*]*$/;
    const companyCodeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;
    const phoneNumberRegex = /^[0-9]*$/; 

    let updatedValue = value;

    if (name === 'companyName' && !companyNameRegex.test(value)) {
        setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
        return;
    } else if (name === 'companyCode' && !companyCodeRegex.test(value)) {
        setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
        return;
    } else if (name === 'phone') {
        if (!phoneNumberRegex.test(value)) {
            setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
            return;
        }
        if (value.length > 10) {
            setFieldErrors({ ...fieldErrors, [name]: '' });
            return;
        } else {
            setFieldErrors({ ...fieldErrors, [name]: '' });
        }
    } else {
        setFieldErrors({ ...fieldErrors, [name]: '' });
    }

    if (name === 'email') {
        updatedValue = updatedValue.toLowerCase();
    } else if (name === 'webSite') {
        updatedValue = updatedValue.toLowerCase();
    } else if (name === 'phone') {
        updatedValue = updatedValue.replace(/[^0-9]/g, '');
    } else {
        updatedValue = updatedValue.toUpperCase();
    }

    if (type === 'checkbox') {
        setFormData({ ...formData, [name]: checked });
    } else {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: updatedValue,
        }));
    }
};


  const handleClear = () => {
    setFormData({
      companyCode: '',
      companyName: '',
      phone: '',
      email: '',
      webSite: '',
      active: true
    });
    setFieldErrors({
      companyCode: '',
      companyName: '',
      phone: '',
      email: '',
      webSite: ''
    });
    setEditId('');
  };

  const handleSave = async () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.companyCode) {
      errors.companyCode = 'Code is required';
    }
    if (!formData.companyName) {
      errors.companyName = 'Name is required';
    }
    if (!formData.phone) {
      errors.phone = 'Phone Number is required';
    }
    if (!formData.webSite) {
      errors.webSite = 'Website is required';
    }
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid Format';
    }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

      const saveData = {
        ...(editId && { id: editId }),
        active: formData.active,
        companyCode: formData.companyCode,
        companyName: formData.companyName,
        createdBy: loginUserName,
        email: formData.email,
        phone: formData.phone,
        webSite: formData.webSite,
        orgId: orgId
      };

      console.log('DATA TO SAVE IS:', saveData);

      try {
        const response = await apiCalls('put', `/companycontroller/updateCreateCompany`, saveData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? ' Elevate Company page Updated Successfully' : 'Elevate Company page created successfully');
          handleClear();
          getAllCompanies();
          // getCompanyById();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.message || 'Elevate Company creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Elevate Company creation failed');
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
              blockEdit={true}
              toEdit={getCompanyById}
            />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <TextField
                  label="Code"
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
                  label="Name"
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
                  label="Phone Number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
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

export default EltCompany;
