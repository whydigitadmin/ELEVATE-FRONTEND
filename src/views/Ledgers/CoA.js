import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, FormHelperText } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import apiCalls from 'apicall';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import { getAllActiveCurrency } from 'utils/CommonFunctions';
import { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import { toast } from 'react-toastify';
import UploadIcon from '@mui/icons-material/Upload';
import CommonBulkUpload from 'utils/CommonBulkUpload';

const CoA = () => {
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [currencies, setCurrencies] = useState([]);
  const [editId, setEditId] = useState('');
  const [groupList, setGroupList] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [allGroupName, setAllGroupName] = useState([]);
  const [formData, setFormData] = useState({
    groupName: '',
    gstTaxFlag: '',
    accountCode: '',
    natureOfAccount: '',
    accountGroupName: '',
    type: '',
    interBranchAc: false,
    controllAc: false,
    currency: 'INR',
    active: false
  });

  const [fieldErrors, setFieldErrors] = useState({
    groupName: false,
    gstTaxFlag: false,
    accountCode: false,
    natureOfAccount: false,
    accountGroupName: false,
    type: false,
    interBranchAc: false,
    controllAc: false,
    currency: false,
    active: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your orgId or fetch it from somewhere
        const currencyData = await getAllActiveCurrency(orgId);
        setCurrencies(currencyData);

        console.log('currency', currencyData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };

    fetchData();
    getGroup();
    getAllGroupName();
  }, []);

  // const handleInputChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   const inputValue = type === 'checkbox' ? checked : value;
  //   setFormData({ ...formData, [name]: inputValue });
  //   setFieldErrors({ ...fieldErrors, [name]: false });
  // };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    let errorMessage = '';
    let validInputValue = inputValue; // Initialize valid input value

    // Validation for accountCode (alphanumeric only)
    if (name === 'accountCode') {
      const alphanumericPattern = /^[a-zA-Z0-9]*$/; // Pattern for alphanumeric
      if (!alphanumericPattern.test(inputValue)) {
        errorMessage = 'Only alphabets and numbers are allowed.';
        // Set validInputValue to prevent invalid character input
        validInputValue = inputValue.replace(/[^a-zA-Z0-9]/g, '');
      }
    }

    // Validation for accountGroupName (alphabets only)

    // Update the form data with the valid input value
    setFormData({ ...formData, [name]: validInputValue });

    // Update the error messages
    setFieldErrors({ ...fieldErrors, [name]: errorMessage });
  };

  const getGroup = async () => {
    try {
      const result = await apiCalls('get', `/master/getAllGroupLedgerByOrgId?orgId=${orgId}`);
      if (result) {
        setData(result.paramObjectsMap.groupLedgerVO.reverse());
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const validateForm = (formData) => {
    let errors = {};

    if (formData.type === 'Account' && !formData.groupName) {
      errors.groupName = 'Group Name is required';
    }

    if (!formData.natureOfAccount || formData.natureOfAccount.length === 0) {
      errors.natureOfAccount = 'Nature of Account is required';
    }

    if (!formData.accountGroupName) {
      errors.accountGroupName = 'Account Group Name is required';
    }

    if (!formData.type) {
      errors.type = 'Type is required';
    }

    if (!formData.accountCode) {
      errors.accountCode = 'Account Code is required';
    }

    return errors;
  };

  const handleBulkUploadOpen = () => {
    setUploadOpen(true);
  };

  const handleBulkUploadClose = () => {
    setUploadOpen(false);
  };

  const handleFileUpload = (event) => {
    console.log(event.target.files[0]);
  };

  const handleSubmit = () => {
    toast.success("File uploaded successfully");
    console.log('Submit clicked');
    handleBulkUploadClose();
    // getAllData();
  };

  const handleSave = async () => {
    const errors = validateForm(formData);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

      const saveData = {
        ...(editId && { id: editId }),
        active: formData.active,
        groupName: formData.groupName,
        gstTaxFlag: formData.gstTaxFlag,
        natureOfAccount: formData.natureOfAccount,
        accountGroupName: formData.accountGroupName,
        type: formData.type,
        interBranchAc: formData.interBranchAc,
        controllAc: formData.controllAc,
        accountCode: formData.accountCode,
        branch: formData.branch,
        currency: 'INR',
        orgId: orgId,
        createdBy: loginUserName
      };

      console.log('DATA TO SAVE', saveData); // Add this line to log the save data

      try {
        const response = await apiCalls('put', `master/updateCreateGroupLedger`, saveData);
        if (response.status === true) {
          showToast('success', editId ? 'Group updated successfully' : 'Group created successfully');
          getGroup();
          handleClear();
        } else {
          showToast('error', editId ? 'Group updation failed' : 'Group creation failed');
        }
        // Handle response (success, errors, etc.)
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false); // Stop the loader after the operation
      }
    } else {
      // Handle validation errors (e.g., show error messages)
      console.log('Validation Errors:', errors);
      setFieldErrors(errors); // Set errors to display in the UI if needed
    }
  };

  const handleClear = () => {
    setFormData({
      groupName: '',
      gstTaxFlag: '',
      accountCode: '',
      natureOfAccount: '',
      accountGroupName: '',
      type: '',
      interBranchAc: false,
      controllAc: false,
      accountCode: '',
      currency: 'INR',
      branch: '',
      active: false
    });
    setFieldErrors({
      groupName: false,
      gstTaxFlag: false,
      accountCode: false,
      natureOfAccount: false,
      accountGroupName: false,
      type: false,
      interBranchAc: false,
      controllAc: false,
      accountCode: false,
      branch: false,
      active: false
    });
    setEditId('');
  };

  const handleListView = () => {
    setShowForm(!showForm);
    setFieldErrors({
      groupName: false,
      gstTaxFlag: false,
      accountCode: false,
      natureOfAccount: false,
      accountGroupName: false,
      type: false,
      interBranchAc: false,
      controllAc: false,
      accountCode: false,
      branch: false,
      active: false
    });
  };

  const columns = [
    { accessorKey: 'type', header: 'Type', size: 100 },
    { accessorKey: 'groupName', header: 'Group Name', size: 140 },
    { accessorKey: 'id', header: 'Account Code', size: 140 },
    { accessorKey: 'accountGroupName', header: 'Account/Groupname', size: 100 },
    { accessorKey: 'natureOfAccount', header: 'Nature of Account', size: 100 },
    // { accessorKey: 'currency', header: 'Currency', size: 100 },
    { accessorKey: 'active', header: 'Active', size: 100 }
  ];

  const getGruopById = async (row) => {
    console.log('Editing Exchange Rate:', row.original.id);
    setEditId(row.original.id);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/master/getAllGroupLedgerById?id=${row.original.id}`);

      if (result) {
        const exRate = result.paramObjectsMap.groupLedgerVO[0];
        setEditMode(true);

        setFormData({
          orgId: orgId,
          groupName: exRate.groupName,
          gstTaxFlag: exRate.gstTaxFlag,
          accountCode: exRate.id,
          natureOfAccount: exRate.natureOfAccount,
          accountGroupName: exRate.accountGroupName,
          type: exRate.type,
          interBranchAc: exRate.interBranchAc,
          controllAc: exRate.controllAc,
          accountCode: exRate.accountCode,
          branch: exRate.branch,
          id: exRate.id,
          currency: 'INR',
          active: exRate.active
        });

        console.log('DataToEdit', exRate);
      } else {
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllGroupName = async () => {
    try {
      const response = await apiCalls('get', `/master/getGroupNameByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setGroupList(response.paramObjectsMap.groupNameDetails);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
      <div>
        <ToastContainer />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="d-flex flex-wrap justify-content-start mb-4">
          <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
          <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
          <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleListView} />
          <ActionButton icon={UploadIcon} title='Upload' onClick={handleBulkUploadOpen} />

          {uploadOpen && (
            <CommonBulkUpload
              open={uploadOpen}
              handleClose={handleBulkUploadClose}
              title="Upload Files"
              uploadText="Upload file"
              downloadText="Sample File"
              onSubmit={handleSubmit}
              handleFileUpload={handleFileUpload}
              screen="PutAway"
            />
          )}

          <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} margin="0 10px 0 10px" />
        </div>
        {/* <div className="d-flex justify-content-between">
          <h1 className="text-xl font-semibold mb-3">Group / Ledger</h1>
        </div> */}
        {showForm ? (
          <div className="row d-flex ">
            <div className="col-md-3 mb-3">
              <Autocomplete
                options={[
                  { type: 'Group' },
                  { type: 'Account' },
                ]}
                getOptionLabel={(option) => option.type || ''}
                value={formData.type ? { type: formData.type } : null}
                onChange={(event, newValue) => {
                  const value = newValue ? newValue.type : '';
                  setFormData((prev) => ({ ...prev, type: value }));
                }}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Type"
                    variant="outlined"
                    error={!!fieldErrors.type}
                    helperText={fieldErrors.type || ''}
                  />
                )}
                clearOnEscape
              />
            </div>

            <div className="col-md-3 mb-3">
              <Autocomplete
                options={allGroupName}
                getOptionLabel={(option) => option.groupName || ''}
                value={formData.groupName ? { allGroupName: formData.groupName } : null}
                onChange={(event, newValue) => {
                  const value = newValue ? newValue.groupName : '';
                  setFormData((prev) => ({ ...prev, groupName: value }));
                }}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Group Name"
                    variant="outlined"
                    error={!!fieldErrors.groupName}
                    helperText={fieldErrors.groupName || ''}
                  />
                )}
                clearOnEscape
              />
            </div>

            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="account"
                  label="Account Code"
                  size="small"
                  required
                  // disabled
                  placeholder="40003600104"
                  inputProps={{ maxLength: 30 }}
                  onChange={handleInputChange}
                  name="accountCode"
                  value={formData.accountCode}
                  error={!!fieldErrors.accountCode}
                  helperText={fieldErrors.accountCode || ''}
                />
              </FormControl>
            </div>

            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="accountGroupName"
                  label="Account/Group Name"
                  size="small"
                  required
                  placeholder="Enter Group Name"
                  inputProps={{ maxLength: 30 }}
                  onChange={handleInputChange}
                  name="accountGroupName"
                  value={formData.accountGroupName}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.accountGroupName ? fieldErrors.accountGroupName : ''}</span>}
                />
              </FormControl>
            </div>


            <div className="col-md-3 mb-3">
              <Autocomplete
                options={[
                  { type: 'Db' },
                  { type: 'Cr' },
                ]}
                getOptionLabel={(option) => option.type || ''}
                value={formData.natureOfAccount ? { type: formData.natureOfAccount } : null}
                onChange={(event, newValue) => {
                  const value = newValue ? newValue.type : '';
                  setFormData((prev) => ({ ...prev, natureOfAccount: value }));
                }}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Nature of Account"
                    variant="outlined"
                    error={!!fieldErrors.natureOfAccount}
                    helperText={fieldErrors.natureOfAccount || ''}
                  />
                )}
                clearOnEscape
              />
            </div>

            <div className="col-md-3 mb-3">
              <FormControl fullWidth size="small">
                <TextField
                  id="currency"
                  label="Currency"
                  size="small"
                  disabled
                  inputProps={{ maxLength: 30 }}
                  onChange={handleInputChange}
                  name="currency"
                  value={formData.currency}
                  // helperText={<span style={{ color: 'red' }}>{fieldErrors.currency ? fieldErrors.currency : ''}</span>}
                />
              </FormControl>
            </div>

            <div className="col-md-3 mb-2">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.interBranchAc}
                      onChange={handleInputChange}
                      name="interBranchAc"
                      sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                    />
                  }
                  label="Interbranch A/c"
                />
              </FormGroup>
            </div>
            <div className="col-md-3 mb-2">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.controllAc}
                      onChange={handleInputChange}
                      name="controllAc"
                      sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                    />
                  }
                  label="Control A/c"
                />
              </FormGroup>
            </div>

            <div className="col-md-3 mb-3">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.active}
                      name="active"
                      onChange={handleInputChange}
                      sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                    />
                  }
                  label="Active"
                />
              </FormGroup>
            </div>
          </div>
        ) : (
          <CommonTable columns={columns} data={data} blockEdit={true} toEdit={getGruopById} />
        )}
      </div>
    </>
  );
};

export default CoA;

