import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, FormHelperText } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import GridOnIcon from '@mui/icons-material/GridOn';
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
  const [data, setData] = useState([]); // For group data to display in table
  const [showForm, setShowForm] = useState(true); // Toggle between form and table view
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [rows, setRows] = useState([{
    // id: 1,
    // ccoa: 'ABC123', // Example initial data
    // coa: 'COA_001',
  }]); // Starts with one row
  const [currencies, setCurrencies] = useState([]);
  const [editId, setEditId] = useState('');
  const [groupList, setGroupList] = useState([]);
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
        const currencyData = await getAllActiveCurrency(orgId);
        setCurrencies(currencyData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };

    fetchData();
    getGroup();
    getAllcoa();
  }, []);

  const addRow = () => {
    const dummyData = [
      // { id: rows, ccoa: 'XYZ456', coa: 'COA_002' },
      { id: rows.length + 1, ccoa: 'XYZ456', coa: 'COA_002' },
      { id: rows.length + 2, ccoa: 'DEF789', coa: 'COA_003' },
    ];
    setRows([...dummyData]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    let errorMessage = '';
    let validInputValue = inputValue;

    if (name === 'ccoa') {
      const alphanumericPattern = /^[a-zA-Z0-9]*$/;
      if (!alphanumericPattern.test(inputValue)) {
        errorMessage = 'Only alphabets and numbers are allowed.';
        validInputValue = inputValue.replace(/[^a-zA-Z0-9]/g, '');
      }
    }

    setFormData({ ...formData, [name]: validInputValue });
    setFieldErrors({ ...fieldErrors, [name]: errorMessage });
  };

  const handleSave = async () => {
    const errors = validateForm(formData);
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      const saveData = {
        ...(editId && { id: editId }),
        active: formData.active,
        coa: formData.coa,
        ccoa: formData.ccoa,
        cancelRemarks: formData.cancelRemarks,
        cancel: false,
        createdBy: loginUserName,
        updatedBy: loginUserName,
      };

      try {
        const response = await apiCalls('put', `/businesscontroller/createUpdateCCoa`, saveData);
        if (response.status === true) {
          showToast('success', editId ? 'Client COA updated successfully' : 'Client COA created successfully');
          getGroup();
          handleClear();
        } else {
          showToast('error', editId ? 'Client COA updation failed' : 'Client COA creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleClear = () => {
    // Reset form data and field errors
    setFormData({ coa: '', ccoa: '' });
    setFieldErrors({ coa: '', ccoa: '' });
  
    // Reset rows to their initial state
    setRows([{ id: 1, ccoa: '', coa: '' }]);
  
    // Reset edit ID and other states if necessary
    setEditId('');
  };
  
  

  const handleListView = () => {
    setShowForm(!showForm);
    setFieldErrors({ coa: false, ccoa: false });
  };

  const columns = [
    { accessorKey: 'ccoa', header: 'Client COA', size: 140 },
    { accessorKey: 'coa', header: 'COA', size: 140 },
  ];

  const getGruopById = async (row) => {
    setEditId(row.original.id);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/businesscontroller/getCCeoById?id=${row.original.id}`);
      if (result) {
        const cao = result.paramObjectsMap.cCoaVO;
        setEditMode(true);
        setFormData({ coa: cao.coa, ccoa: cao.ccoa });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getGroup = async () => {
    try {
      const result = await apiCalls('get', ``);
      if (result) {
        setData(result.paramObjectsMap.cCoaVO.reverse());
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllcoa = async () => {
    try {
      const response = await apiCalls('get', ``);
      if (response.status === true) {
        setGroupList(response.paramObjectsMap.cCoaVO);
      } else {
        console.error('API Error:', response);
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
          <ActionButton title="Fill Grid" icon={GridOnIcon} onClick={addRow} />
        </div>

        {showForm ? (
          <div className="row d-flex ">
            {rows.map((row, index) => (
              <div key={index} className="row d-flex">
                {/* Client COA input */}
                <div className="col-3 mb-3">
                  <TextField
                    name="ccoa"
                    value={row.ccoa || ''}
                    label="Client COA"
                    onChange={(event) => handleInputChange(index, event)}
                    fullWidth
                    variant="outlined"
                    disabled
                    size="small"
                    error={!!fieldErrors[`ccoa-${index}`]}
                    helperText={fieldErrors[`ccoa-${index}`] || ''}
                  />
                </div>
                 {/* CCOA Code */}
                 <div className="col-3 mb-3">
                  <TextField
                    name="ccoa"
                    value={row.ccoa || ''}
                    label="CCOA Code"
                    onChange={(event) => handleInputChange(index, event)}
                    fullWidth
                    variant="outlined"
                    disabled
                    size="small"
                    error={!!fieldErrors[`ccoa-${index}`]}
                    helperText={fieldErrors[`ccoa-${index}`] || ''}
                  />
                </div>

                {/* COA select */}
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    options={groupList}
                    getOptionLabel={(option) => option.group || ''}
                    value={
                      row.coa
                        ? groupList.find((item) => item.group === row.coa)
                        : null
                    }
                    onChange={(event, newValue) => {
                      const value = newValue ? newValue.group : ''; // Update the value based on the selected option
                      handleInputChange(index, { target: { name: 'coa', value } }); // Update the value in your form data
                    }}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="COA"
                        variant="outlined"
                        error={!!fieldErrors[`coa-${index}`]}
                        helperText={fieldErrors[`coa-${index}`] || ''}
                      />
                    )}
                    clearOnEscape
                  />
                </div>

                 {/* COA Code */}
                 <div className="col-3 mb-3">
                  <TextField
                    name="ccoa"
                    value={row.ccoa || ''}
                    label="COA Code"
                    onChange={(event) => handleInputChange(index, event)}
                    fullWidth
                    variant="outlined"
                    size="small"
                    error={!!fieldErrors[`ccoa-${index}`]}
                    helperText={fieldErrors[`ccoa-${index}`] || ''}
                  />
                </div>
              </div>
            ))}
          </div>

        ) : (
          <CommonTable columns={columns} data={data} blockEdit={true} toEdit={getGruopById} />
        )}
      </div>
    </>
  );
};

export default LedgersMapping;