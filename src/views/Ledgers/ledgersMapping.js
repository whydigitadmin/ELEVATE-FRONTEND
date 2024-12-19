import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, Checkbox, FormControl, FormControlLabel, FormGroup, TextField } from '@mui/material';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import UploadIcon from '@mui/icons-material/Upload';
import SampleFile from '../../../src/assets/sample-files/LedgerMappingUpload.xlsx';

const LedgersMapping = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [clientCode, setClientCode] = useState(localStorage.getItem('clientCode'));
  const [client, setClient] = useState(localStorage.getItem('client'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [uploadOpen, setUploadOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientCoa: '',
    clientCoaCode: '',
    coa: '',
    coaCode: '',
    active: '',
    // clientCode: '',
    clientName: ''
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [allClientAccountCode, setAllClientAccountCode] = useState([]);
  const [allCOA, setAllCOA] = useState([]);
  const [editId, setEditId] = useState('');
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));

  useEffect(() => {
    if (loginUserName) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        clientCode: loginUserName
      }));
    }
    getAllLedgerMapping();
    getCOALedgersMapping();
    getAccountCodeLedgersMapping();
  }, [loginUserName]);

  const getAllLedgerMapping = async () => {
    try {
      const result = await apiCalls('get', `businesscontroller/getAllLedgerMapping`);
      if (result) {
        setData(result.paramObjectsMap.ledgerMappingVO.reverse());
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getCOALedgersMapping = async () => {
    try {
      const response = await apiCalls('get', `/businesscontroller/getCOAForLedgerMapping?orgId=${orgId}`);
      if (response.status === true) {
        setAllCOA(response.paramObjectsMap.ledgerMappingVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAccountCodeLedgersMapping = async () => {
    setLoading(true);
    try {
      const response = await apiCalls('get', `/businesscontroller/getFillGridForLedgerMapping?clientCode=WDS&orgId=${orgId}`);
      if (response.status === true) {
        setAllClientAccountCode(response.paramObjectsMap.COA);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
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

  const handleSubmit = async () => {
    console.log('Submit clicked');
    handleBulkUploadClose();
  };

  const handleSave = async () => {
    const errors = {};

    if (!formData.clientCoaCode) {
      errors.clientCoaCode = 'Account Code is required';
    }
    if (!formData.coaCode) {
      errors.coaCode = 'COA Code is required';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      const saveData = {
        ...formData,
        clientCode: clientCode,
        clientName: client,
        createdBy: loginUserName,
        orgId: parseInt(orgId)
      };

      try {
        const response = await apiCalls('put', '/businesscontroller/createUpdateLedgerMapping', saveData);

        if (response.status === true) {
          showToast(
            'success',
            editId ? 'Ledgers Mapping updated successfully' : 'Ledgers Mapping created successfully'
          );
          getAllLedgerMapping();
          handleClear();
        } else {
          showToast('error', 'Ledgers Mapping creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClear = () => {
    setFormData({
      clientCoaCode: '',
      clientCoa: '',
      coa: '',
      // coaCode: '',
      active: '',
      clientCode: '',
      clientName: ''
    });

    setFieldErrors({});
  };

  const handleListView = () => {
    setShowForm(!showForm);
    setFieldErrors({});
  };

  const columns = [
    { accessorKey: 'clientCoaCode', header: 'Account Code', size: 100 },
    { accessorKey: 'clientCoa', header: 'Account Name', size: 140 },
    { accessorKey: 'coaCode', header: 'COA Code', size: 100 },
    { accessorKey: 'coa', header: 'COA', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 },
  ];

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
              apiUrl={`businesscontroller/excelUploadForLedgerMapping`}
              screen="PutAway"
              clientCode={clientCode}
              clientName={client}
              orgId={orgId}
              loginUser={loginUserName}
            />

          )}
        </div>
        {showForm ? (
          <div className="row d-flex">

            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <Autocomplete
                  options={allClientAccountCode}
                  getOptionLabel={(option) => option ? option.clientAccountCode : ''}
                  value={allClientAccountCode.find((item) => item.clientAccountCode === formData.clientCoaCode)}
                  onChange={(event, newValue) => {
                    setFormData({
                      ...formData,
                      clientCoa: newValue ? newValue.clientAccountName : '',
                      clientCoaCode: newValue ? newValue.clientAccountCode : ''
                    });
                  }}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Account Code"
                      variant="outlined"
                      name="clientCoaCode"
                      error={!!fieldErrors.clientCoaCode}
                      helperText={fieldErrors.clientCoaCode || ''}
                    />
                  )}
                />
              </FormControl>
            </div>

            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  label="Account Name"
                  size="small"
                  disabled
                  name="clientAccountName"
                  value={formData.clientCoa}
                />
              </FormControl>
            </div>

            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <Autocomplete
                  options={allCOA}
                  getOptionLabel={(option) => (option ? option.accountCode : '')}
                  value={allCOA.find((item) => item.accountCode === formData.coaCode) || null}
                  onChange={(event, newValue) => {
                    setFormData({
                      ...formData,
                      coa: newValue ? newValue.accountGroupName : '',
                      coaCode: newValue ? newValue.accountCode : ''
                    });
                  }}
                  size="small"
                  renderInput={(params) => ( 
                    <TextField 
                      {...params} 
                      label="COA Code" 
                      variant="outlined" 
                      error={!!fieldErrors.coaCode}
                      helperText={fieldErrors.coaCode || ''}
                    />
                  )}
                />
              </FormControl>
            </div>

            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  label="COA Name"
                  size="small"
                  disabled
                  name="coaCode"
                  value={formData.coa}
                />
              </FormControl>
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
          <CommonTable columns={columns} data={data} />
        )}
      </div>
    </>
  );
};

export default LedgersMapping;

