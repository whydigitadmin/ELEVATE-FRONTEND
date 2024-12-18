import React from 'react'
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
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
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AddIcon from '@mui/icons-material/Add';
import GridOnIcon from '@mui/icons-material/GridOn';

const ClientTB = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [clientCode, setClientCode] = useState(localStorage.getItem('clientCode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [month, setMonth] = useState(localStorage.getItem('month'));
  const [editId, setEditId] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [formData, setFormData] = useState({
    tbNo: '',
    docDate: dayjs(),
    totalCreditAmount: '',
    totalDebitAmount: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    tbNo: false,
    totalCreditAmount: false,
    totalDebitAmount: false
  });

  const [tbData, setTbData] = useState([
    {
      accountCode: '',
      accountName: '',
      credit: '',
      debit: '',
    }
  ]);
  const [tbErrors, setTbErrors] = useState([
    {
      accountCode: '',
      accountName: '',
      credit: '',
      debit: '',
    }
  ]);

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
    let errors = {};
    let tbValidationErrors = tbData.map((row) => ({
      accountCode: row.accountCode ? '' : 'Account Code is required',
      accountName: row.accountName ? '' : 'Account Name is required',
      debit: row.debit ? '' : 'Debit is required',
      credit: row.credit ? '' : 'Credit is required'
    }));

    if (!formData.totalCreditAmount) {
      errors.totalCreditAmount = 'Total Credit Amount is required';
    }
    if (!formData.totalDebitAmount) {
      errors.totalDebitAmount = 'Total Debit Amount is required';
    }
    if (!formData.tbNo) {
      errors.tbNo = 'Trail Balance No is required';
    }

    const hasTbErrors = tbValidationErrors.some(
      (rowErrors) => Object.values(rowErrors).some((error) => error)
    );

    setFieldErrors(errors);
    setTbErrors(tbValidationErrors);

    if (Object.keys(errors).length > 0 || hasTbErrors) {
      console.log('Validation Errors:', errors, tbValidationErrors);
      return;
    }

    setIsLoading(true);

    const saveData = {
      ...(editId && { id: editId }),
      active: formData.active,
      totalCreditAmount: formData.totalCreditAmount,
      totalDebitAmount: formData.totalDebitAmount,
      tbNo: formData.tbNo,
      createdBy: loginUserName,
      updatedBy: loginUserName
    };

    console.log('DATA TO SAVE', saveData);

    try {
      const response = await apiCalls('put', `businesscontroller/createUpdateCoa`, saveData);
      if (response.status === true) {
        showToast('success', editId ? 'COA updated successfully' : 'COA created successfully');
        handleClear();
      } else {
        showToast('error', editId ? 'COA updation failed' : 'COA creation failed');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleClear = () => {
    setFieldErrors({
      tbNo: '',
      totalCreditAmount: '',
      totalDebitAmount: '',
    });
  
    setTbErrors(
      tbData.map(() => ({
        accountCode: '',
        accountName: '',
        debit: '',
        credit: '',
      }))
    );
  };
  


  const handleListView = () => {
    setShowForm(!showForm);
    setFieldErrors({
      tbNo: false,
      totalCreditAmount: false,
      totalDebitAmount: false,
      tbNo: false,
      active: false
    });
  };

  const columns = [
    { accessorKey: 'tbNo', header: 'Trail Balance No', size: 140 },
    { accessorKey: 'docDate', header: 'Date', size: 140 },
    { accessorKey: 'totalCreditAmount', header: 'Total Credit Amount', size: 100 },
    { accessorKey: 'totalDebitAmount', header: 'Total Debit Amount', size: 100 },
    { accessorKey: 'active', header: 'Active', size: 100 }
  ];

  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date);
    console.log('formattedDate', formattedDate);
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAddRow = () => {
    setTbData([...tbData, { accountCode: '', accountName: '', debit: '', credit: '' }]);
    setTbErrors([...tbErrors, { accountCode: '', accountName: '', debit: '', credit: '' }]);
    if (isLastRowEmpty(tbData)) {
      displayRowError(tbData);
      return;
    }

    const newRow = {
      id: Date.now(),
      accountCode: '',
      accountName: '',
      credit: '',
      debit: ''
    };

    setTbData([...tbData, newRow]);
    setTbErrors([...tbErrors, { accountCode: '', accountName: '', credit: '', debit: '' }]);
  };

  const isLastRowEmpty = (data) => {
    if (data.length === 0) return false;
    const lastRow = data[data.length - 1];
    return !lastRow.accountCode || !lastRow.accountName || !lastRow.credit || !lastRow.debit;
  };

  const displayRowError = (table) => {
    if (table && table.length > 0) {
      setTbErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        const lastRowIndex = table.length - 1;
        const lastRow = table[lastRowIndex];

        newErrors[lastRowIndex] = {
          accountCode: !lastRow.accountCode ? 'Account Code is required' : '',
          accountName: !lastRow.accountName ? 'Account Name is required' : '',
          credit: !lastRow.credit ? 'Credit is required' : '',
          debit: !lastRow.debit ? 'Debit is required' : '',
        };

        return newErrors;
      });
    }
  };

  const handleFillGrid = async () => {
    console.log('Editing Exchange Rate:', loginUserName);
    setIsLoading(true);

    try {
      const result = await apiCalls('get', `/trailBalanceController/getFillGridForTbExcelUpload?clientCode=${clientCode}&finYear=${finYear}&month=${month}`);

      if (result && result.paramObjectsMap && result.paramObjectsMap.excelUploadForTb) {
        const fillGrid = result.paramObjectsMap.excelUploadForTb;

        console.log('DataToEdit:', fillGrid);

        const mappedData = fillGrid.map((grid, index) => ({
          id: index + 1,
          accountCode: grid.accountCode || '',
          accountName: grid.accountName || '',
          credit: grid.credit || '',
          debit: grid.debit || '',
        }));

        setTbData(mappedData);

        setTbErrors(mappedData.map(() => ({})));

        console.log('Mapped Data:', mappedData);
      } else {
        console.error('No valid data received from the API');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
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
              apiUrl="trailBalanceController/excelUploadForTb"
              screen="PutAway"
              loginUser={loginUserName}
              clientCode={clientCode}
              finYear={finYear}
              month={month}
            />

          )}

          <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} margin="0 10px 0 10px" />
        </div>

        {showForm ? (
          <>
            <div className="row d-flex ">

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="tbNo"
                    label="Trail Balance No"
                    size="small"
                    disabled
                    inputProps={{ maxLength: 30 }}
                    onChange={handleInputChange}
                    name="tbNo"
                    value={formData.tbNo}
                    error={!!fieldErrors.tbNo}
                    helperText={fieldErrors.tbNo || ''}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date"
                      value={formData.docDate}
                      onChange={(date) => handleDateChange('docDate', date)}
                      disabled
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="totalCreditAmount"
                    label="Total Credit Amount"
                    size="small"
                    placeholder=''
                    disabled
                    inputProps={{ maxLength: 30 }}
                    onChange={handleInputChange}
                    name="totalCreditAmount"
                    value={formData.totalCreditAmount}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.totalCreditAmount ? fieldErrors.totalCreditAmount : ''}</span>}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="totalDebitAmount"
                    label="Total Debit Amount"
                    size="small"
                    disabled
                    inputProps={{ maxLength: 30 }}
                    onChange={handleInputChange}
                    name="totalDebitAmount"
                    value={formData.totalDebitAmount}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.totalDebitAmount ? fieldErrors.totalDebitAmount : ''}</span>}
                  />
                </FormControl>
              </div>
            </div>

            <div className="row mt-2">
              <Box sx={{ width: '100%' }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  textColor="secondary"
                  indicatorColor="secondary"
                  aria-label="secondary tabs example"
                >
                  <Tab value={0} label="TB" />
                </Tabs>
              </Box>
              <Box sx={{ padding: 2 }}>
                {value === 0 && (
                  <>
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                        <ActionButton title="Fill Grid" icon={GridOnIcon} isLoading={isLoading} onClick={handleFillGrid} />
                      </div>
                      <div className="row mt-2">
                        <div className="col-lg-12">
                          <div className="table-responsive">
                            <table className="table table-bordered ">
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  {/* <th className="table-header">Action</th> */}
                                  <th className="table-header">S.No</th>
                                  <th className="table-header">Account Code</th>
                                  <th className="table-header">Account Name</th>
                                  <th className="table-header">Db</th>
                                  <th className="table-header">Cr</th>
                                </tr>
                              </thead>
                              <tbody>
                                {tbData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="text-center">
                                      {index + 1}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.accountCode}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setTbData((prev) =>
                                            prev.map((r, i) => (i === index ? { ...r, accountCode: value } : r))
                                          );
                                          setTbErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              accountCode: !value ? 'Account Code is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={tbErrors[index]?.accountCode ? 'error form-control' : 'form-control'}
                                      />
                                      {tbErrors[index]?.accountCode && (
                                        <div style={{ color: 'red', fontSize: '12px' }}>
                                          {tbErrors[index].accountCode}
                                        </div>
                                      )}
                                    </td>

                                    {/* Account Name Input */}
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.accountName}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setTbData((prev) =>
                                            prev.map((r, i) => (i === index ? { ...r, accountName: value } : r))
                                          );
                                          setTbErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              accountName: !value ? 'Account Name is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={tbErrors[index]?.accountName ? 'error form-control' : 'form-control'}
                                      />
                                      {tbErrors[index]?.accountName && (
                                        <div style={{ color: 'red', fontSize: '12px' }}>
                                          {tbErrors[index].accountName}
                                        </div>
                                      )}
                                    </td>

                                    {/* Debit Input */}
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.debit}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setTbData((prev) =>
                                            prev.map((r, i) => (i === index ? { ...r, debit: value } : r))
                                          );
                                          setTbErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              debit: !value ? 'Debit is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={tbErrors[index]?.debit ? 'error form-control' : 'form-control'}
                                      />
                                      {tbErrors[index]?.debit && (
                                        <div style={{ color: 'red', fontSize: '12px' }}>
                                          {tbErrors[index].debit}
                                        </div>
                                      )}
                                    </td>

                                    {/* Credit Input */}
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.credit}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setTbData((prev) =>
                                            prev.map((r, i) => (i === index ? { ...r, credit: value } : r))
                                          );
                                          setTbErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              credit: !value ? 'Credit is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={tbErrors[index]?.credit ? 'error form-control' : 'form-control'}
                                      />
                                      {tbErrors[index]?.credit && (
                                        <div style={{ color: 'red', fontSize: '12px' }}>
                                          {tbErrors[index].credit}
                                        </div>
                                      )}
                                    </td>

                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Box>
            </div>

          </>
        ) : (
          <CommonTable columns={columns} data={data} blockEdit={true} />
        )}
      </div>
    </>
  );
};

export default ClientTB;


