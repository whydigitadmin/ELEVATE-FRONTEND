import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormHelperText } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormCOA from '@mui/material/FormGroup';
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

const LedgersMapping = () => {
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
  const [COAList, setCOAList] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [formData, setFormData] = useState({
    COAName: '',
    gstTaxFlag: '',
    accountCode: '',
    coaList: '',
    accountCOAName: '',
    type: '',
    interBranchAc: false,
    controllAc: false,
    category: '',
    currency: 'INR',
    active: false
  });

  const [fieldErrors, setFieldErrors] = useState({
    COAName: false,
    gstTaxFlag: false,
    accountCode: false,
    coaList: false,
    accountCOAName: false,
    type: false,
    interBranchAc: false,
    controllAc: false,
    category: false,

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
    getCOA();
    getAllCOAName();
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

    // Validation for accountCOAName (alphabets only)

    // Update the form data with the valid input value
    setFormData({ ...formData, [name]: validInputValue });

    // Update the error messages
    setFieldErrors({ ...fieldErrors, [name]: errorMessage });
  };

  const getCOA = async () => {
    try {
      const result = await apiCalls('get', `/master/getAllCOALedgerByOrgId?orgId=${orgId}`);
      if (result) {
        setData(result.paramObjectsMap.COALedgerVO.reverse());
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const validateForm = (formData) => {
    let errors = {};

    if (formData.type === 'ACCOUNT' ? !formData.COAName : '') {
      errors.COAName = 'COA Name is required';
    }

    if (!formData.gstTaxFlag) {
      errors.gstTaxFlag = 'GST Tax Flag is required';
    }

    if (!formData.coaList || formData.coaList.length === 0) {
      errors.coaList = 'COA List is required';
    }

    if (!formData.accountCOAName) {
      errors.accountCOAName = 'Account COA Name is required';
    }

    if (!formData.type) {
      errors.type = 'Type is required';
    }

    if (!formData.category) {
      errors.category = 'Category is required';
    }

    // if (!formData.currency) {
    //   errors.currency = 'Currency is required';
    // }

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
    const errors = validateForm(formData); // Validate the form data

    if (Object.keys(errors).length === 0) {
      // No errors, proceed with the save
      setIsLoading(true);

      const saveData = {
        ...(editId && { id: editId }), // Include id if editing
        active: formData.active,
        COAName: formData.COAName,
        gstTaxFlag: formData.gstTaxFlag,
        coaList: formData.coaList,
        accountCOAName: formData.accountCOAName,
        type: formData.type,
        interBranchAc: formData.interBranchAc,
        controllAc: formData.controllAc,
        category: formData.category,
        branch: formData.branch,
        currency: 'INR',
        orgId: orgId,
        createdBy: loginUserName
      };

      console.log('DATA TO SAVE', saveData); // Add this line to log the save data

      try {
        const response = await apiCalls('put', `master/updateCreateCOALedger`, saveData);
        if (response.status === true) {
          showToast('success', editId ? 'COA updated successfully' : 'COA created successfully');
          getCOA();
          handleClear();
        } else {
          showToast('error', editId ? 'COA updation failed' : 'COA creation failed');
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
      COAName: '',
      gstTaxFlag: '',
      accountCode: '',
      coaList: '',
      accountCOAName: '',
      type: '',
      interBranchAc: false,
      controllAc: false,
      category: '',
      branch: '',
      // currency: '',
      active: false
    });
    setFieldErrors({
      COAName: false,
      gstTaxFlag: false,

    });
    setEditId('');
  };

  const handleListView = () => {
    setShowForm(!showForm);
    setFieldErrors({
      COAName: false,
      gstTaxFlag: false,
      active: false
    });
  };

  const columns = [
    { accessorKey: 'COAName', header: 'Customer COA', size: 140 },
    { accessorKey: 'id', header: 'COA', size: 140 },
  ];

  const getGruopById = async (row) => {
    console.log('Editing Exchange Rate:', row.original.id);
    setEditId(row.original.id);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/master/getAllCOALedgerById?id=${row.original.id}`);

      if (result) {
        const exRate = result.paramObjectsMap.COALedgerVO[0];
        setEditMode(true);

        setFormData({
          orgId: orgId,
          COAName: exRate.COAName,
          gstTaxFlag: exRate.gstTaxFlag,
          accountCode: exRate.id,
          coaList: exRate.coaList,
          accountCOAName: exRate.accountCOAName,
          type: exRate.type,
          interBranchAc: exRate.interBranchAc,
          controllAc: exRate.controllAc,
          category: exRate.category,
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

  const getAllCOAName = async () => {
    try {
      const response = await apiCalls('get', `/master/getCOANameByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setCOAList(response.paramObjectsMap.COANameDetails);
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
      <div
        className="card w-full p-6 bg-base-100 shadow-xl custom-card-border" // Add custom class for border
        style={{ padding: '20px' }}
      >
        <div className="d-flex flex-wrap justify-content-start mb-4">
          <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
          <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
          <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleListView} />
          <ActionButton icon={UploadIcon} title="Upload" onClick={handleBulkUploadOpen} />

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

        {showForm ? (
          <div className="row d-flex justify-content-center">
            <div className="d-flex justify-content-center" style={{ gap: '20px' }}> {/* Adding gap between fields */}
              <div className="col-md-3 mb-3 custom-border">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="account"
                    label="Customer COA"
                    size="small"
                    required
                    disabled
                    placeholder="40003600104"
                    inputProps={{ maxLength: 30 }}
                    onChange={handleInputChange}
                    name="accountCode"
                    value={formData.accountCode}
                    className="custom-border"
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3 custom-border">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">COA</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Type"
                    onChange={handleInputChange}
                    name="type"
                    value={formData.type}
                    className="custom-border"
                  >
                    <MenuItem value="ACCOUNT">Account</MenuItem>
                    <MenuItem value="COA">COA</MenuItem>
                  </Select>
                  {fieldErrors.type && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>}
                </FormControl>
              </div>
            </div>
            <div className="d-flex justify-content-center" style={{ gap: '20px' }}> {/* Adding gap between fields */}
              <div className="col-md-3 mb-3 custom-border">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="account"
                    label="Customer COA"
                    size="small"
                    required
                    disabled
                    placeholder="40003600104"
                    inputProps={{ maxLength: 30 }}
                    onChange={handleInputChange}
                    name="accountCode"
                    value={formData.accountCode}
                    className="custom-border"
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3 custom-border">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">COA</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Type"
                    onChange={handleInputChange}
                    name="type"
                    value={formData.type}
                    className="custom-border"
                  >
                    <MenuItem value="ACCOUNT">Account</MenuItem>
                    <MenuItem value="COA">COA</MenuItem>
                  </Select>
                  {fieldErrors.type && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>}
                </FormControl>
              </div>
            </div>
            <div className="d-flex justify-content-center" style={{ gap: '20px' }}> {/* Adding gap between fields */}
              <div className="col-md-3 mb-3 custom-border">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="account"
                    label="Customer COA"
                    size="small"
                    required
                    disabled
                    placeholder="40003600104"
                    inputProps={{ maxLength: 30 }}
                    onChange={handleInputChange}
                    name="accountCode"
                    value={formData.accountCode}
                    className="custom-border"
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3 custom-border">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">COA</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Type"
                    onChange={handleInputChange}
                    name="type"
                    value={formData.type}
                    className="custom-border"
                  >
                    <MenuItem value="ACCOUNT">Account</MenuItem>
                    <MenuItem value="COA">COA</MenuItem>
                  </Select>
                  {fieldErrors.type && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>}
                </FormControl>
              </div>
            </div>
            <div className="d-flex justify-content-center" style={{ gap: '20px' }}> {/* Adding gap between fields */}
              <div className="col-md-3 mb-3 custom-border">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="account"
                    label="Customer COA"
                    size="small"
                    required
                    disabled
                    placeholder="40003600104"
                    inputProps={{ maxLength: 30 }}
                    onChange={handleInputChange}
                    name="accountCode"
                    value={formData.accountCode}
                    className="custom-border"
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3 custom-border">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">COA</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Type"
                    onChange={handleInputChange}
                    name="type"
                    value={formData.type}
                    className="custom-border"
                  >
                    <MenuItem value="ACCOUNT">Account</MenuItem>
                    <MenuItem value="COA">COA</MenuItem>
                  </Select>
                  {fieldErrors.type && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>}
                </FormControl>
              </div>
            </div>
            <div className="d-flex justify-content-center" style={{ gap: '20px' }}> {/* Adding gap between fields */}
              <div className="col-md-3 mb-3 custom-border">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="account"
                    label="Customer COA"
                    size="small"
                    required
                    disabled
                    placeholder="40003600104"
                    inputProps={{ maxLength: 30 }}
                    onChange={handleInputChange}
                    name="accountCode"
                    value={formData.accountCode}
                    className="custom-border"
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3 custom-border">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">COA</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Type"
                    onChange={handleInputChange}
                    name="type"
                    value={formData.type}
                    className="custom-border" 
                  >
                    <MenuItem value="ACCOUNT">Customer COA</MenuItem>
                    <MenuItem value="COA">COA</MenuItem>
                  </Select>
                  {fieldErrors.type && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>}
                </FormControl>
              </div>
            </div>
          </div>

        ) : (
          <CommonTable columns={columns} data={data} blockEdit={true} toEdit={getGruopById} />
        )}
      </div>
    </>
  );
};


export default LedgersMapping;


