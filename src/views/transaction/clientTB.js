import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import GridOnIcon from '@mui/icons-material/GridOn';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import UploadIcon from '@mui/icons-material/Upload';
import { Button, Checkbox, Modal, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import SampleFile from '../../assets/sample-files/tbsampledata.xlsx';

import { Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const ClientTB = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [clientCode, setClientCode] = useState(localStorage.getItem('clientCode'));
  const [client, setClient] = useState(localStorage.getItem('client'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [month, setMonth] = useState(localStorage.getItem('month'));
  const [editId, setEditId] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [value, setValue] = useState(0);
  const [formData, setFormData] = useState({
    tbNo: '',
    docDate: dayjs(),
    totalCreditAmount: '',
    totalDebitAmount: ''
  });

  const [popupData, setPopupData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    tbNo: false,
    totalCreditAmount: false,
    totalDebitAmount: false
  });

  const [tbData, setTbData] = useState([
    {
      accountCode: '',
      accountName: '',
      coaCode: '',
      coa: '',
      credit: '',
      debit: '',
      openingBalance: '',
      closingBalance: ''
    }
  ]);
  const [tbErrors, setTbErrors] = useState([
    {
      accountCode: '',
      accountName: '',
      coaCode: '',
      coa: '',
      credit: '',
      debit: '',
      openingBalance: '',
      closingBalance: ''
    }
  ]);

  useEffect(() => {
    getDocId();
    getAllTB();
  }, []);

  const getDocId = async () => {
    try {
      const result = await apiCalls('get', `/trailBalanceController/getTBDocId?orgId=${orgId}&finYear=${finYear}&clientCode=${clientCode}`);
      if (result) {
        setFormData((prevData) => ({
          ...prevData,
          tbNo: result.paramObjectsMap.tbDocId,
          docDate: dayjs()
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
    }
  };

  const getAllTB = async () => {
    try {
      const result = await apiCalls(
        'get',
        `/trailBalanceController/getAllTrialBalanceByClient?orgId=${orgId}&finYear=${finYear}&client=${client}`
      );
      if (result) {
        setListViewData(result.paramObjectsMap.tbHeaderVO);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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
      accountName: row.accountName ? '' : 'Account Name is required'
    }));

    if (!formData.tbNo) {
      errors.tbNo = 'Trail Balance No is required';
    }

    const hasTbErrors = tbValidationErrors.some((rowErrors) => Object.values(rowErrors).some((error) => error));

    setFieldErrors(errors);
    setTbErrors(tbValidationErrors);

    if (Object.keys(errors).length > 0 || hasTbErrors) {
      console.log('Validation Errors:', errors, tbValidationErrors);
      return;
    }

    setIsLoading(true);

    // Map tbData to the expected structure
    const mappedTbData = tbData.map((row) => ({
      clientAccountCode: row.accountCode,
      clientAccountName: row.accountName,
      debit: parseFloat(row.debit) || 0,
      credit: parseFloat(row.credit) || 0,
      openingBalance: parseFloat(row.openingBalance) || 0,
      closingBalance: parseFloat(row.closingBalance) || 0,
      coa: row.coa || '',
      coaCode: row.coaCode || ''
    }));

    const saveData = {
      ...(editId && { id: editId }),
      active: formData.active,
      totalCreditAmount: formData.totalCreditAmount,
      totalDebitAmount: formData.totalDebitAmount,
      tbNo: formData.tbNo,
      createdBy: loginUserName,
      updatedBy: loginUserName,
      client: client,
      clientCode: clientCode,
      tbMonth: month,
      orgId: orgId,
      finYear: finYear,
      tbDetailsDTO: mappedTbData // Include the mapped tbData
    };

    console.log('DATA TO SAVE', saveData);

    try {
      const response = await apiCalls('put', `/trailBalanceController/createUpdateTrailBalance`, saveData);
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
      totalDebitAmount: ''
    });

    setTbData([
      {
        accountCode: '',
        accountName: '',
        coaCode: '',
        coa: '',
        credit: '',
        debit: '',
        openingBalance: '',
        closingBalance: ''
      }
    ]);
    setFormData([
      {
        tbNo: '',
        docDate: dayjs(),
        totalCreditAmount: '',
        totalDebitAmount: ''
      }
    ]);

    getDocId();

    setTbErrors(
      tbData.map(() => ({
        accountCode: '',
        accountName: '',
        debit: '',
        credit: '',
        coaCode: '',
        coa: '',
        openingBalance: '',
        closingBalance: ''
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
    { accessorKey: 'docId', header: 'Trial Balance No', size: 140 },
    { accessorKey: 'docDate', header: 'Date', size: 140 },
    { accessorKey: 'tbMonth', header: 'TB Month', size: 100 }
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
    setTbData([
      ...tbData,
      { accountCode: '', accountName: '', debit: '', credit: '', coaCode: '', coa: '', openingBalance: '', closingBalance: '' }
    ]);
    setTbErrors([
      ...tbErrors,
      { accountCode: '', accountName: '', debit: '', credit: '', coaCode: '', coa: '', openingBalance: '', closingBalance: '' }
    ]);
    if (isLastRowEmpty(tbData)) {
      displayRowError(tbData);
      return;
    }

    const newRow = {
      id: Date.now(),
      accountCode: '',
      accountName: '',
      credit: '',
      debit: '',
      coaCode: '',
      coa: '',
      openingBalance: '',
      closingBalance: ''
    };

    setTbData([...tbData, newRow]);
    setTbErrors([
      ...tbErrors,
      { accountCode: '', accountName: '', credit: '', debit: '', coaCode: '', coa: '', openingBalance: '', closingBalance: '' }
    ]);
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
          coaCode: !lastRow.coaCode ? 'coaCode is required' : '',
          coa: !lastRow.coa ? 'coa is requied' : '',
          openingBalance: !lastRow.openingBalance ? 'opening Balance is required' : '',
          closingBalance: !lastRow.closingBalance ? 'closing Balance is required' : ''
        };

        return newErrors;
      });
    }
  };

  const handleFillGrid = async () => {
    // setIsLoading(true);
    try {
      const result = await apiCalls(
        'get',
        `/trailBalanceController/getFillGridForTbFromExcelUpload?clientCode=${clientCode}&client=${client}&finYear=${finYear}&tbMonth=${month}&orgId=${orgId}`
      );

      if (result?.paramObjectsMap?.excelUploadForTb) {
        const fillGrid = result.paramObjectsMap.excelUploadForTb;

        const mappedData = fillGrid.map((grid, index) => ({
          id: index + 1,
          accountCode: grid.clientAccountCode || '',
          accountName: grid.clientAccountName || '',
          coaCode: grid.coaCode || '',
          coa: grid.coa || '',
          openingBalance: grid.openingBalance,
          closingBalance: grid.closingBalance,
          credit: grid.credit,
          debit: grid.debit
        }));

        setPopupData(mappedData);
        setIsPopupOpen(true); // Open popup
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      // setIsLoading(false);
    }
  };

  const handleSelectAll = (event) => {
    setIsSelectAllChecked(event.target.checked);
    setSelectedRows(event.target.checked ? popupData.map((row) => row.id) : []);
  };

  const handleRowSelection = (rowId) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(rowId) ? prevSelected.filter((id) => id !== rowId) : [...prevSelected, rowId]
    );
  };

  const handleConfirm = () => {
    const selectedData = popupData.filter((item) => selectedRows.includes(item.id));
    setTbData(selectedData); // Set selected data in the main state
    setIsPopupOpen(false); // Close popup
  };

  const columnss = [
    {
      field: 'select',
      headerName: <Checkbox checked={isSelectAllChecked} onChange={handleSelectAll} color="primary" />,
      width: 50,
      renderCell: (params) => (
        <Checkbox checked={selectedRows.includes(params.row.id)} onChange={() => handleRowSelection(params.row.id)} color="primary" />
      ),
      sortable: false,
      disableColumnMenu: true
    },
    { field: 'accountCode', headerName: 'Account Code', width: 140 },
    { field: 'accountName', headerName: 'Account Name', width: 140 },
    { field: 'coaCode', headerName: 'COA Code', width: 140 },
    { field: 'coa', headerName: 'COA', width: 140 },
    { field: 'openingBalance', headerName: 'Opening Balance', width: 140 },
    { field: 'closingBalance', headerName: 'Closing Balance', width: 140 },
    { field: 'credit', headerName: 'Credit', width: 140 },
    { field: 'debit', headerName: 'Debit', width: 140 }
  ];

  const handleCheckboxChange = (id) => {
    setSelectedRows((prevSelected) => (prevSelected.includes(id) ? prevSelected.filter((rowId) => rowId !== id) : [...prevSelected, id]));
  };

  // const handleConfirm = () => {
  //   const selectedData = popupData.filter((item) => selectedRows.includes(item.id));
  //   setTbData(selectedData); // Set selected data in the main state
  //   setIsPopupOpen(false); // Close popup
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
          <ActionButton icon={UploadIcon} title="Upload" onClick={handleBulkUploadOpen} />

          {uploadOpen && (
            <CommonBulkUpload
              open={uploadOpen}
              handleClose={handleBulkUploadClose}
              dialogTitle="Upload Files"
              uploadText="Upload File"
              downloadText="Sample File"
              fileName="ClientTbsampledata.xlsx"
              onSubmit={handleSubmit}
              sampleFileDownload={SampleFile}
              handleFileUpload={handleFileUpload}
              apiUrl="trailBalanceController/excelUploadForTb"
              screen="PutAway"
              loginUser={loginUserName}
              clientCode={clientCode}
              clientName={client}
              finYear={finYear}
              month={month}
              orgId={orgId}
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
                                  <th className="table-header">COA Code</th>
                                  <th className="table-header">COA</th>
                                  <th className="table-header">Op Bal</th>
                                  <th className="table-header">Db</th>
                                  <th className="table-header">Cr</th>
                                  <th className="table-header">Cl Bal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {tbData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="text-center">{index + 1}</td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.accountCode}
                                        style={{ width: '100px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setTbData((prev) => prev.map((r, i) => (i === index ? { ...r, accountCode: value } : r)));
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
                                        <div style={{ color: 'red', fontSize: '12px' }}>{tbErrors[index].accountCode}</div>
                                      )}
                                    </td>

                                    {/* Account Name Input */}
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.accountName}
                                        style={{ width: 'auto' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setTbData((prev) => prev.map((r, i) => (i === index ? { ...r, accountName: value } : r)));
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
                                        <div style={{ color: 'red', fontSize: '12px' }}>{tbErrors[index].accountName}</div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.coaCode}
                                        style={{ width: '100px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setTbData((prev) => prev.map((r, i) => (i === index ? { ...r, coaCode: value } : r)));
                                          setTbErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              coaCode: !value ? 'coaCode is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={tbErrors[index]?.coaCode ? 'error form-control' : 'form-control'}
                                      />
                                      {tbErrors[index]?.coaCode && (
                                        <div style={{ color: 'red', fontSize: '12px' }}>{tbErrors[index].coaCode}</div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.coa}
                                        style={{ width: 'auto' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setTbData((prev) => prev.map((r, i) => (i === index ? { ...r, coa: value } : r)));
                                          setTbErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              coa: !value ? 'coa is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={tbErrors[index]?.coa ? 'error form-control' : 'form-control'}
                                      />
                                      {tbErrors[index]?.coa && <div style={{ color: 'red', fontSize: '12px' }}>{tbErrors[index].coa}</div>}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                                          row.openingBalance || 0
                                        )}
                                        style={{ width: '150px' }}
                                        onChange={(e) => {
                                          const rawValue = e.target.value.replace(/,/g, ''); // Remove commas for numeric conversion
                                          const numericValue = parseFloat(rawValue);

                                          if (!isNaN(numericValue)) {
                                            setTbData((prev) =>
                                              prev.map((r, i) => (i === index ? { ...r, openingBalance: numericValue } : r))
                                            );

                                            setTbErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                openingBalance: !numericValue ? 'openingBalance is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }
                                        }}
                                        className={tbErrors[index]?.openingBalance ? 'error form-control' : 'form-control'}
                                      />
                                      {tbErrors[index]?.openingBalance && (
                                        <div style={{ color: 'red', fontSize: '12px' }}>{tbErrors[index].openingBalance}</div>
                                      )}
                                    </td>

                                    {/* Debit Input */}
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                                          row.debit || 0
                                        )}
                                        style={{ width: '150px' }}
                                        onChange={(e) => {
                                          const rawValue = e.target.value.replace(/,/g, ''); // Remove commas for numeric conversion
                                          const numericValue = parseFloat(rawValue);

                                          if (!isNaN(numericValue)) {
                                            setTbData((prev) => prev.map((r, i) => (i === index ? { ...r, debit: numericValue } : r)));

                                            setTbErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                debit: !numericValue ? 'Debit is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }
                                        }}
                                        className={tbErrors[index]?.debit ? 'error form-control' : 'form-control'}
                                      />
                                      {tbErrors[index]?.debit && (
                                        <div style={{ color: 'red', fontSize: '12px' }}>{tbErrors[index].debit}</div>
                                      )}
                                    </td>

                                    {/* Credit Input */}
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                                          row.credit || 0
                                        )}
                                        style={{ width: '150px' }}
                                        onChange={(e) => {
                                          const rawValue = e.target.value.replace(/,/g, ''); // Remove commas for numeric conversion
                                          const numericValue = parseFloat(rawValue);

                                          if (!isNaN(numericValue)) {
                                            setTbData((prev) => prev.map((r, i) => (i === index ? { ...r, credit: numericValue } : r)));

                                            setTbErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                credit: !numericValue ? 'Credit is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }
                                        }}
                                        className={tbErrors[index]?.credit ? 'error form-control' : 'form-control'}
                                      />
                                      {tbErrors[index]?.credit && (
                                        <div style={{ color: 'red', fontSize: '12px' }}>{tbErrors[index].credit}</div>
                                      )}
                                    </td>

                                    {/* Closing Balance Input */}
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                                          row.closingBalance || 0
                                        )}
                                        style={{ width: '150px' }}
                                        onChange={(e) => {
                                          const rawValue = e.target.value.replace(/,/g, ''); // Remove commas for numeric conversion
                                          const numericValue = parseFloat(rawValue);

                                          if (!isNaN(numericValue)) {
                                            setTbData((prev) =>
                                              prev.map((r, i) => (i === index ? { ...r, closingBalance: numericValue } : r))
                                            );

                                            setTbErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                closingBalance: !numericValue ? 'Closing Balance is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }
                                        }}
                                        className={tbErrors[index]?.closingBalance ? 'error form-control' : 'form-control'}
                                      />
                                      {tbErrors[index]?.closingBalance && (
                                        <div style={{ color: 'red', fontSize: '12px' }}>{tbErrors[index].closingBalance}</div>
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

            <Modal open={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
              <Box
                sx={{
                  width: '90%',
                  margin: 'auto',
                  marginTop: '5%',
                  padding: '20px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: 24
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Select Records
                </Typography>
                <Paper sx={{ height: 400, width: '100%' }}>
                  <DataGrid
                    rows={popupData}
                    columns={columnss}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 15]}
                    checkboxSelection={false}
                    disableSelectionOnClick
                    components={{
                      NoRowsOverlay: () => <Typography>No records available</Typography>
                    }}
                  />
                </Paper>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <Button onClick={() => setIsPopupOpen(false)} color="secondary" variant="outlined">
                    Cancel
                  </Button>
                  <Button onClick={handleConfirm} color="primary" variant="contained" sx={{ marginLeft: '10px' }}>
                    Confirm
                  </Button>
                </Box>
              </Box>
            </Modal>
          </>
        ) : (
          <CommonTable columns={columns} data={listViewData} blockEdit={true} />
        )}
      </div>
    </>
  );
};

export default ClientTB;
