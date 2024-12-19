import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
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
import { toast } from 'react-toastify';
import UploadIcon from '@mui/icons-material/Upload';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import SampleFile from '../../assets/sample-files/SampleFormat.xlsx';

const ClientCOA = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [clientCode, setClientCode] = useState(localStorage.getItem('clientCode'));
  const [client, setClient] = useState(localStorage.getItem('client'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [editId, setEditId] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [formData, setFormData] = useState({
    accountCode: '',
    accountName: '',
    active: false
  });

  const [fieldErrors, setFieldErrors] = useState({
    accountCode: false,
    accountName: false,
    active: false
  });

  useEffect(() => {
    getAllCCao();
    // getAllGroupName();
  }, []);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    let errorMessage = '';
    let validInputValue = inputValue;

    setFormData({ ...formData, [name]: validInputValue });

    setFieldErrors({ ...fieldErrors, [name]: errorMessage });
  };

  const getAllCCao = async () => {
    try {
      const result = await apiCalls('get', `/businesscontroller/getAllCCao?clientCode=${clientCode}&orgId=${orgId}`);
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

    if (!formData.accountName) {
      errors.accountName = 'Account Name is required';
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
  };

  const handleSave = async () => {
    const errors = validateForm(formData);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

      const saveData = {
        ...(editId && { id: editId }),
        active: formData.active,
        accountCode: formData.accountCode,
        accountName: formData.accountName,
        createdBy: loginUserName,
        currency: 'INR',
        clientCode: clientCode,
        clientName: client,
        orgId: parseInt(orgId)
      };

      console.log('DATA TO SAVE', saveData);

      try {
        const response = await apiCalls('put', `/businesscontroller/createUpdateCCoa`, saveData);
        if (response.status === true) {
          showToast('success', editId ? 'Client COA updated successfully' : 'Client COA created successfully');
          getAllCCao();
          // getAllGroupName();
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
      console.log('Validation Errors:', errors);
      setFieldErrors(errors);
    }
  };

  const handleClear = () => {
    setFormData({
      accountCode: '',
      accountName: '',
      active: false
    });
    setFieldErrors({
      accountCode: false,
      accountName: false,
      active: false
    });
    setEditId('');
  };

  const handleListView = () => {
    setShowForm(!showForm);
    setFieldErrors({
      accountCode: false,
      accountName: false,
      active: false
    });
  };

  const columns = [
    { accessorKey: 'accountCode', header: 'Account Code', size: 140 },
    { accessorKey: 'accountName', header: 'Account Name', size: 100 },
    { accessorKey: 'active', header: 'Active', size: 100 }
  ];

  const getGruopById = async (row) => {
    console.log('Editing Exchange Rate:', row.original.id);
    setEditId(row.original.id);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/businesscontroller/getCCaoById?id=${row.original.id}`);

      if (result) {
        const cao = result.paramObjectsMap.cCoaVO;
        setEditMode(true);

        setFormData({
          accountName: cao.accountName,
          accountCode: cao.accountCode,
          active: cao.active
        });

        console.log('DataToEdit', cao);
      } else {
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
              fileName="sampleFile.xlsx"
              onSubmit={handleSubmit}
              sampleFileDownload={SampleFile}
              handleFileUpload={handleFileUpload}
              apiUrl={`/businesscontroller/excelUploadForCCoa`}
              screen="PutAway"
              loginUser={loginUserName}
              clientCode={clientCode}
            />
          )}

          <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} margin="0 10px 0 10px" />
        </div>

        {showForm ? (
          <>
            <div className="row d-flex ">
              {/* Account Code */}
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
              {/* Account/Group Name */}
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="accountName"
                    label="Account/Group Name"
                    size="small"
                    required
                    placeholder="Enter Group Name"
                    inputProps={{ maxLength: 30 }}
                    onChange={handleInputChange}
                    name="accountName"
                    value={formData.accountName}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.accountName ? fieldErrors.accountName : ''}</span>}
                  />
                </FormControl>
              </div>
              {/* active */}
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
          </>
        ) : (
          <CommonTable columns={columns} data={data} blockEdit={true} toEdit={getGruopById} />
        )}
      </div>
    </>
  );
};

export default ClientCOA;

