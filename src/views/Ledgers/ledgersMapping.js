import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, FormHelperText } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import GridOnIcon from '@mui/icons-material/GridOn';
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
import { format } from 'date-fns';

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
  const [groupList, setGroupList] = useState([]);
  // const [page, setPage] = useState(0);  // Pagination: Track the current page
  // const [itemsPerPage] = useState(5);   // Number of items per page
  const [uploadOpen, setUploadOpen] = useState(false);
  const [allcoa, setAllcoa] = useState([]);
  const [formData, setFormData] = useState({
    coa: '',
    ccoa: '',
  });

  const [fieldErrors, setFieldErrors] = useState({
    coa: false,
    ccoa: false,
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
    getAllcoa();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    let errorMessage = '';
    let validInputValue = inputValue; // Initialize valid input value

    // Validation for ccoa (alphanumeric only)
    if (name === 'ccoa') {
      const alphanumericPattern = /^[a-zA-Z0-9]*$/; // Pattern for alphanumeric
      if (!alphanumericPattern.test(inputValue)) {
        errorMessage = 'Only alphabets and numbers are allowed.';
        // Set validInputValue to prevent invalid character input
        validInputValue = inputValue.replace(/[^a-zA-Z0-9]/g, '');
      }
    }


    // Update the form data with the valid input value
    setFormData({ ...formData, [name]: validInputValue });

    // Update the error messages
    setFieldErrors({ ...fieldErrors, [name]: errorMessage });
  };

  // list Api
  const getGroup = async () => {
    try {
      const result = await apiCalls('get', ``);
      if (result) {
        setData(result.paramObjectsMap.cCoaVO.reverse());
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const validateForm = (formData) => {
    let errors = {};
    if (!formData.ccoa) {
      errors.ccoa = 'Client COA is required';
    }
    if (!formData.coa) {
      errors.coa = 'COA is required';
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
        coa: formData.coa,
        ccoa: format.ccoa,
        cancelRemarks: formData.cancelRemarks,
        cancel: false,
        createdBy: loginUserName,
        updatedBy: loginUserName
      };

      console.log('DATA TO SAVE', saveData); // Add this line to log the save data
      // Save API
      try {
        const response = await apiCalls('put', `/businesscontroller/createUpdateCCoa`, saveData);
        if (response.status === true) {
          showToast('success', editId ? 'Client COA updated successfully' : 'Client COA created successfully');
          getGroup();
          handleClear();
        } else {
          showToast('error', editId ? 'Client COA updation failed' : 'Client COA creation failed');
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
      coa: '',
      ccoa: '',
    });
    setFieldErrors({
      coa: false,
      ccoa: false,
    });
    setEditId('');
  };

  const handleListView = () => {
    setShowForm(!showForm);
    setFieldErrors({
      coa: false,
      ccoa: false,
    });
  };

  const columns = [
    { accessorKey: 'ccoa', header: 'Client COA', size: 140 },
    { accessorKey: 'coa', header: 'COA', size: 140 },
  ];

  const getGruopById = async (row) => {
    console.log('Editing Exchange Rate:', row.original.id);
    setEditId(row.original.id);
    setShowForm(true);
    // Edit API
    try {
      const result = await apiCalls('get', `/businesscontroller/getCCeoById?id=${row.original.id}`);

      if (result) {
        const cao = result.paramObjectsMap.cCoaVO;
        setEditMode(true);

        setFormData({
          coa: cao.coa,
          ccoa: cao.ccoa,
        });

        console.log('DataToEdit', cao);
      } else {
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // COA ApI 
  const getAllcoa = async () => {
    try {
      const response = await apiCalls('get', ``);
      console.log('API Response:', response);

      if (response.status === true) {
        setGroupList(response.paramObjectsMap.cCoaVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // FillGrid
  const handleFillGrid = async () => {
    try {
      const response = await apiCalls('get', `/businesscontroller/getAllClientCoa`);
      console.log('Fill Grid Data:', response);

      if (response && response.status === true) {
        const clientCoaData = response.paramObjectsMap.cCoaVO.reverse(); // Adjust as per API response
        setData(clientCoaData);
        setShowForm(false); // Switch to table view
        showToast('success', 'Grid populated with Client COA data.');
      } else {
        showToast('error', 'Failed to load Client COA data.');
      }
    } catch (error) {
      console.error('Error loading grid data:', error);
      showToast('error', 'An error occurred while loading the grid data.');
    }
  };

  // Get paginated data
  // const paginatedData = data.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  // const handlePageChange = (newPage) => {
  //   // Ensure newPage is within the valid range
  //   if (newPage >= 0 && newPage * itemsPerPage < data.length) {
  //     setPage(newPage);  // Update the page state
  //   }
  // };




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
          <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} />
          <ActionButton title="Fill Grid" icon={GridOnIcon} onClick={handleFillGrid} />


        </div>
        {showForm ? (
          <div className="row d-flex ">
            <div className='d-flex justify-content-center align-items-center' style={{ gap: '20px' }}>
              {/* Client COA */}
              <div className="col-md-3 mb-3 ">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="ccoa"
                    label="Client COA"
                    size="small"
                    required
                    disabled
                    inputProps={{ maxLength: 30 }}
                    onChange={handleInputChange}
                    name="ccoa"
                    value={formData.ccoa}
                    error={!!fieldErrors.ccoa}
                    helperText={fieldErrors.ccoa || ''}
                  />
                </FormControl>
              </div>
              {/* COA */}
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small" error={!!fieldErrors.coa}>
                  <InputLabel id="demo-simple-select-label">COA</InputLabel>
                  <Select
                    labelId="coa"
                    id="coa"
                    label="COA"
                    onChange={handleInputChange}
                    name="coa"
                    value={formData.coa}
                    error={!!fieldErrors.coa}  // Set the error prop here
                  >
                    {groupList.length > 0 &&
                      groupList.map((gro, index) => (
                        <MenuItem key={index} value={gro.group}>
                          {gro.group}
                        </MenuItem>
                      ))}
                  </Select>
                  {fieldErrors.coa && (
                    <FormHelperText style={{ color: 'red' }}>
                      COA This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
            </div>
          </div>
        ) : (
          <CommonTable columns={columns} data={data} blockEdit={true} toEdit={getGruopById} />
        )}

        {/* Pagination Controls */}
        {/* <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
            Previous
          </button>
          <span>{`Page ${page + 1}`}</span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page * itemsPerPage + itemsPerPage >= data.length}
          >
            Next
          </button>
        </div> */}
      </div>
    </>
  );
};

export default LedgersMapping;