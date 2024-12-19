import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import UploadIcon from '@mui/icons-material/Upload';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import SampleFile from '../../assets/sample-files/SampleFormat.xlsx';

const CoA = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [editId, setEditId] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [allGroupName, setAllGroupName] = useState([]);
  const [createdBy, setCreatedBy] = useState(null);
  const [formData, setFormData] = useState({
    groupName: '',
    accountCode: '',
    natureOfAccount: '',
    accountGroupName: '',
    type: '',
    commonDate: '',
    branch: '',
    interBranchAc: false,
    controllAc: false,
    currency: 'INR',
    active: false
  });

  const [fieldErrors, setFieldErrors] = useState({
    groupName: false,
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
    getGroup();
    getAllGroupName();
  }, []);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    let errorMessage = '';
    let validInputValue = inputValue;

    if (name === 'accountCode') {
      const alphanumericPattern = /^[a-zA-Z0-9]*$/;
      if (!alphanumericPattern.test(inputValue)) {
        errorMessage = 'Only alphabets and numbers are allowed.';
        validInputValue = inputValue.replace(/[^a-zA-Z0-9]/g, '');
      }
    }

    setFormData({ ...formData, [name]: validInputValue });

    setFieldErrors({ ...fieldErrors, [name]: errorMessage });
  };

  const getGroup = async () => {
    try {
      const result = await apiCalls('get', `/businesscontroller/getAllCao?orgId=${orgId}`);
      if (result) {
        setData(result.paramObjectsMap.coaVO.reverse());
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
    // const createdByUser = loginUser || 'default_user';
    // setCreatedBy(createdByUser);
    setUploadOpen(true);
  };

  const handleBulkUploadClose = () => {
    // const createdByValue = loginUser || 'default_user';
    // setCreatedBy(createdByValue);
    setUploadOpen(false);
  };

  const handleFileUpload = (event) => {
    console.log(event.target.files[0]);
  };

  const handleSubmit = async () => {
    console.log('Submit clicked');
    handleBulkUploadClose();
  };

  const handleSave = async () => {
    const errors = validateForm(formData);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

      const saveData = {
        ...(editId && { id: editId }),
        active: formData.active,
        groupName: formData.groupName !== null && formData.groupName !== '' ? formData.groupName : null,
        natureOfAccount: formData.natureOfAccount,
        accountGroupName: formData.accountGroupName,
        parentId: formData.parentId,
        parentCode: formData.parentCode,
        type: formData.type,
        interBranchAc: formData.interBranchAc,
        controllAc: formData.controllAc,
        accountCode: formData.accountCode,
        currency: 'INR',
        createdBy: loginUserName,
        updatedBy: loginUserName,
        orgId: parseInt(orgId)
      };

      console.log('DATA TO SAVE', saveData);

      try {
        const response = await apiCalls('put', `businesscontroller/createUpdateCoa`, saveData);
        if (response.status === true) {
          showToast('success', editId ? 'COA updated successfully' : 'COA created successfully');
          getGroup();
          getAllGroupName();
          handleClear();
        } else {
          showToast('error', editId ? 'COA updation failed' : 'COA creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('Validation Errors:', errors);
      setFieldErrors(errors);
    }
  };

  const handleClear = () => {
    setFormData({
      groupName: '',
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
    { accessorKey: 'accountCode', header: 'Account Code', size: 140 },
    { accessorKey: 'accountGroupName', header: 'Account/Groupname', size: 100 },
    { accessorKey: 'groupName', header: 'Group Name', size: 140 },
    { accessorKey: 'parentCode', header: 'Parent Code', size: 100 },
    { accessorKey: 'natureOfAccount', header: 'Nature of Account', size: 100 },
    { accessorKey: 'type', header: 'Type', size: 100 },
    { accessorKey: 'active', header: 'Active', size: 100 }
  ];

  const getGruopById = async (row) => {
    console.log('Editing Exchange Rate:', row.original.id);
    setEditId(row.original.id);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/businesscontroller/getCaoById?id=${row.original.id}`);

      if (result) {
        const cao = result.paramObjectsMap.coaVO;
        setEditMode(true);

        setFormData({
          type: cao.type,
          groupName: cao.groupName,
          accountGroupName: cao.accountGroupName,
          accountCode: cao.accountCode,
          natureOfAccount: cao.natureOfAccount,
          interBranchAc: cao.interBranchAc,
          controllAc: cao.controllAc,
          currency: 'INR',
          active: cao.active
        });

        console.log('DataToEdit', cao);
      } else {
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllGroupName = async () => {
    try {
      const response = await apiCalls('get', `/businesscontroller/getGroupName?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setAllGroupName(response.paramObjectsMap.coaVO);
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
              dialogTitle="Upload Files"
              uploadText="Upload File"
              downloadText="Sample File"
              fileName="sampleFile.xlsx"
              onSubmit={handleSubmit}
              sampleFileDownload={SampleFile}
              handleFileUpload={handleFileUpload}
              apiUrl="businesscontroller/excelUploadForCoa"
              screen="PutAway"
              loginUser={loginUserName}
              // createdBy={loginUserName}
            // loginUser={localStorage.getItem('loginUserName')} // Pass the loginUserName here
            />

          )}

          <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} margin="0 10px 0 10px" />
        </div>

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
                    label={
                      <span>
                        Type<span style={{ color: 'red' }}> *</span>
                      </span>
                    }
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
                getOptionLabel={(option) => option.group || ''}
                value={
                  formData.groupName
                    ? allGroupName.find((item) => item.group === formData.groupName)
                    : null
                }
                onChange={(event, newValue) => {
                  const value = newValue ? newValue.group : '';
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
                    label={
                      <span>
                        Nature of Account<span style={{ color: 'red' }}> *</span>
                      </span>
                    }
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

