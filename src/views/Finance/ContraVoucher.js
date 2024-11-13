import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import { getAllActiveCurrency } from 'utils/CommonFunctions';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import apiCalls from 'apicall';

const ContraVoucher = () => {
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));

  const [currencies, setCurrencies] = useState([]);
  const [allbankName, setAllbankName] = useState([]);
  const [allAccountName, setAllAccountName] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [editId, setEditId] = useState('');
  const [docId, setDocId] = useState('');
  const [data, setData] = useState(true);
  const [value, setValue] = useState(0);
  const [formData, setFormData] = useState({
    orgId: orgId,
    docDate: dayjs(),
    referenceNo: '',
    referenceDate: '',
    chequeNo: '',
    chequeDate: dayjs(),
    currency: '',
    exRate: '',
    totalCreditAmount: 0,
    totalDebitAmount: 0,
    remarks: ''
  });
  const [fieldErrors, setFieldErrors] = useState({
    docDate: dayjs(),
    referenceNo: '',
    referenceDate: '',
    chequeNo: '',
    chequeDate: dayjs(),
    currency: '',
    exRate: '',
    totalCreditAmount: 0,
    totalDebitAmount: 0,
    remarks: ''
  });
  const [detailsTableData, setDetailsTableData] = useState([
    {
      id: 1,
      subLedgerCode: '',
      subledgerName: '',
      accountName: '',
      debit: '',
      credit: '',
      narration: ''
    }
  ]);

  const [detailsTableErrors, setDetailsTableErrors] = useState([
    {
      subLedgerCode: '',
      subledgerName: '',
      accountName: '',
      debit: '',
      credit: '',
      narration: ''
    }
  ]);
  const listViewColumns = [
    { accessorKey: 'currency', header: 'Currency', size: 140 },
    { accessorKey: 'exchangeRate', header: 'Ex.Rate', size: 140 },
    { accessorKey: 'chequeNo', header: 'Ref No', size: 140 },
    { accessorKey: 'docId', header: 'Document Id', size: 140 }
  ];

  const handleClear = () => {
    setFormData({
      docDate: dayjs(),
      referenceNo: '',
      referenceDate: '',
      chequeNo: '',
      chequeDate: dayjs(),
      currency: '',
      exRate: '',
      totalCreditAmount: 0,
      totalDebitAmount: 0,
      remarks: ''
    });
    getAllActiveCurrency(orgId);
    setFieldErrors({
      docDate: dayjs(),
      referenceNo: '',
      referenceDate: '',
      chequeNo: '',
      chequeDate: dayjs(),
      currency: '',
      exRate: '',
      totalCreditAmount: 0,
      totalDebitAmount: 0,
      remarks: ''
    });
    setDetailsTableData([{ id: 1, accountName: '', subLedgerCode: '', subledgerName: '', debit: '', credit: '', narration: '' }]);
    setDetailsTableErrors('');
    setEditId('');
    getContraVoucherDocId();
  };

  const handleView = () => {
    setShowForm(!showForm);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAddRow = () => {
    if (isLastRowEmpty(detailsTableData)) {
      displayRowError(detailsTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      accountName: '',
      subLedgerCode: '',
      subledgerName: '',
      debit: '',
      credit: '',
      narration: ''
    };
    setDetailsTableData([...detailsTableData, newRow]);
    setDetailsTableErrors([
      ...detailsTableErrors,
      { accountName: '', subLedgerCode: '', subledgerName: '', debit: '', credit: '', narration: '' }
    ]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === detailsTableData) {
      return (
        !lastRow.accountName || !lastRow.subLedgerCode || !lastRow.subledgerName || !lastRow.credit || !lastRow.debit || !lastRow.narration
      );
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === detailsTableData) {
      setDetailsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          subledgerName: !table[table.length - 1].subledgerName ? 'Account Name is required' : '',
          credit: !table[table.length - 1].credit ? 'Credit is required' : '',
          subLedgerCode: !table[table.length - 1].subLedgerCode ? 'Account Name is required' : '',
          credit: !table[table.length - 1].credit ? 'Credit is required' : '',
          debit: !table[table.length - 1].debit ? 'Debit is required' : '',
          narration: !table[table.length - 1].narration ? 'Narration is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleDeleteRow = (id, table, setTable, errorTable, setErrorTable) => {
    const rowIndex = table.findIndex((row) => row.id === id);
    if (rowIndex !== -1) {
      const updatedData = table.filter((row) => row.id !== id);
      const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
      setTable(updatedData);
      setErrorTable(updatedErrors);
    }
  };

  const handleDebitChange = (e, row, index) => {
    const value = e.target.value;

    if (/^\d{0,20}$/.test(value)) {
      setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, debit: value, credit: value ? '0' : '' } : r)));

      setDetailsTableErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = {
          ...newErrors[index],
          debit: !value ? 'Debit Amount is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleCreditChange = (e, row, index) => {
    const value = e.target.value;

    if (/^\d{0,20}$/.test(value)) {
      setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, credit: value, debit: value ? '0' : '' } : r)));

      setDetailsTableErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = {
          ...newErrors[index],
          credit: !value ? 'Credit Amount is required' : ''
        };
        return newErrors;
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const currencyData = await getAllActiveCurrency(orgId);
        // setCurrencies(currencyData);
        // console.log('currency', currencyData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };

    fetchData();
    getContraVoucherDocId();
    getContraVoucherByOrgId();
    getAllAccountName();
  }, []);

  useEffect(() => {
    const totalDebit = detailsTableData.reduce((sum, row) => sum + Number(row.debit || 0), 0);
    const totalCredit = detailsTableData.reduce((sum, row) => sum + Number(row.credit || 0), 0);
    const depositamount = formData.depositAmount || 0;
    console.log(depositamount);

    setFormData((prev) => ({
      ...prev,
      totalDebitAmount: totalDebit,
      totalCreditAmount: totalCredit,
      totalAmount: depositamount
    }));
  }, [detailsTableData]);

  const getContraVoucherDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/transaction/getContraVoucherDocId?branchCode=${branchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
      );
      console.log('docid working');

      setDocId(response.paramObjectsMap.contraVoucherDocId);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getContraVoucherByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/transaction/getAllContraVoucherByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.contraVoucherVO || []);
      console.log('contraVoucherVO', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getAllContraVoucherById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/transaction/getContraVoucherById?id=${row.original.id}`);

      if (result) {
        const CvVO = result.paramObjectsMap.contraVoucherVO[0];
        setEditId(row.original.id);
        setDocId(CvVO.docId);
        setFormData({
          docDate: CvVO.docDate ? dayjs(CvVO.docDate, 'YYYY-MM-DD') : dayjs(),
          chequeNo: CvVO.chequeNo,
          chequeDate: CvVO.chequeDate ? dayjs(CvVO.chequeDate, 'YYYY-MM-DD') : dayjs(),
          referenceNo: CvVO.referenceNo,
          referenceDate: CvVO.referenceDate,
          currency: CvVO.currency,
          exRate: CvVO.exchangeRate,
          remarks: CvVO.remarks,
          orgId: CvVO.orgId,
          totalDebitAmount: CvVO.totalDebitAmount,
          totalCreditAmount: CvVO.totalCreditAmount
        });
        setDetailsTableData(
          CvVO.depositparticularsVO.map((row) => ({
            id: row.id,
            accountName: row.accountsName,
            subLedgerCode: row.subLedgerCode,
            subledgerName: row.subledgerName,
            debit: row.debit,
            credit: row.credit,
            narration: row.narration
          }))
        );

        console.log('DataToEdit', CvVO);
      } else {
        // Handle erro
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.currency) {
      errors.currency = 'Currency is required';
    }
    if (!formData.exRate) {
      errors.exRate = 'Ex Rate is required';
    }
    if (!formData.referenceNo) {
      errors.referenceNo = 'Reference No is required';
    }
    if (!formData.remarks) {
      errors.remarks = 'Remarks is required';
    }
    if (!formData.referenceDate) {
      errors.referenceDate = 'Deposit Mode is required';
    }
    if (!formData.chequeNo) {
      errors.chequeNo = 'Cheque No is required';
    }

    let detailTableDataValid = true;
    const newTableErrors = detailsTableData.map((row) => {
      const rowErrors = {};
      if (!row.accountName) {
        rowErrors.accountName = 'Account Name is required';
        detailTableDataValid = false;
      }
      if (!row.credit && !row.debit) {
        rowErrors.credit = 'Credit is required';
        // rowErrors.debit = 'Debit is required';
        detailTableDataValid = false;
      }
      if (!row.credit && !row.debit) {
        // rowErrors.credit = 'Credit is required';
        rowErrors.debit = 'Debit is required';
        detailTableDataValid = false;
      }
      if (!row.subLedgerCode) {
        rowErrors.subLedgerCode = 'Sub Ledger Code is required';
        detailTableDataValid = false;
      }
      if (!row.subledgerName) {
        rowErrors.subledgerName = 'Sub ledger Name is required';
        detailTableDataValid = false;
      }
      if (!row.narration) {
        rowErrors.narration = 'Narration is required';
        detailTableDataValid = false;
      }
      return rowErrors;
    });
    setFieldErrors(errors);

    setDetailsTableErrors(newTableErrors);

    if (Object.keys(errors).length === 0 && detailTableDataValid) {
      const contraVoucherVO = detailsTableData.map((row) => ({
        ...(editId && { id: row.id }),
        accountsName: row.accountName,
        subLedgerCode: row.subLedgerCode,
        subledgerName: row.subledgerName,
        credit: row.credit,
        debit: row.debit,
        narration: row.narration
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        branch: branch,
        branchCode: branchCode,
        createdBy: loginUserName,
        finYear: finYear,
        orgId: orgId,
        contraVoucherParticularsDTO: contraVoucherVO,
        currency: formData.currency,
        exchangeRate: parseInt(formData.exRate),
        referenceDate: formData.referenceDate,
        chequeNo: formData.chequeNo,
        chequeDate: dayjs(formData.chequeDate).format('YYYY-MM-DD'),
        referenceNo: formData.referenceNo,
        remarks: formData.remarks
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `/transaction/updateCreateBankingDeposit`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'ContraVoucher Updated Successfully' : 'ContraVoucher Created successfully');
          getContraVoucherByOrgId();
          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.message || 'ContraVoucher creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'ContraVoucher creation failed');
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const getAllAccountName = async () => {
    try {
      const response = await apiCalls('get', `/transaction/getAccountNameFromGroup?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setAllAccountName(response.paramObjectsMap.generalJournalVO);
        console.log('Account Name', response.paramObjectsMap.generalJournalVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date);
    console.log('formattedDate', formattedDate);
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd, type } = e.target;
    let errorMessage = '';

    switch (name) {
      case 'exRate':
        if (isNaN(value)) errorMessage = 'Invalid format';
        break;
      case 'referenceNo':
        if (!/^[A-Za-z0-9\s]*$/.test(value)) {
          errorMessage = 'Invalid format';
        }
        break;
      case 'chequeNo':
        if (!/^[A-Za-z0-9\s]*$/.test(value)) {
          errorMessage = 'Invalid format';
        }
        break;
      case 'credit':
        if (isNaN(value)) {
          errorMessage = 'Invalid format';
        }
        break;
      case 'debit':
        if (isNaN(value)) {
          errorMessage = 'Invalid format';
        }
        break;
      default:
        break;
    }

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage
    }));

    if (!errorMessage) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value.toUpperCase()
      }));

      // Preserve the cursor position for text-based inputs
      if (type === 'text' || type === 'textarea') {
        setTimeout(() => {
          const inputElement = document.getElementsByName(name)[0];
          if (inputElement && inputElement.setSelectionRange) {
            inputElement.setSelectionRange(selectionStart, selectionEnd);
          }
        }, 0);
      }
    }
  };
  return (
    <>
      <div>
        <ToastComponent />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
          </div>

          {showForm ? (
            <>
              <div className="row d-flex ml">
                <div className="col-md-3 mb-3">
                  <TextField id="docId" label="Document Id" variant="outlined" size="small" fullWidth name="docId" value={docId} disabled />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Document Date"
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
                  <TextField
                    id="referenceNo"
                    label={
                      <span>
                        Reference No <span className="asterisk">*</span>
                      </span>
                    }
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="referenceNo"
                    value={formData.referenceNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.referenceNo ? fieldErrors.referenceNo : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.referenceNo}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Reference Date"
                        error={!!fieldErrors.refDate}
                        value={formData.refDate}
                        onChange={(date) => handleDateChange('refDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                    {fieldErrors.refDate && <p className="dateErrMsg">Ref Date is required</p>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="chequeNo"
                    label={
                      <span>
                        Cheque No <span className="asterisk">*</span>
                      </span>
                    }
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="chequeNo"
                    value={formData.chequeNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.chequeNo ? fieldErrors.chequeNo : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.chequeNo}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Cheque Date"
                        value={formData.chequeDate}
                        onChange={(date) => handleDateChange('chequeDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.currency}>
                    <InputLabel id="currency">
                      {
                        <span>
                          Currency <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="currency"
                      id="currency"
                      label="Currency"
                      onChange={handleInputChange}
                      name="currency"
                      value={formData.currency}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.currency}>
                          {item.currency}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.currency && <FormHelperText style={{ color: 'red' }}>Currency is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="exRate"
                    label={
                      <span>
                        Ex. Rate <span className="asterisk">*</span>
                      </span>
                    }
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="exRate"
                    value={formData.exRate}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.exRate ? fieldErrors.exRate : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.exRate}
                  />
                </div>
                <div className="row d-flex">
                  <div className="col-md-8">
                    <FormControl fullWidth variant="filled">
                      <TextField
                        id="remarks"
                        label="Remarks"
                        size="small"
                        name="remarks"
                        value={formData.remarks}
                        multiline
                        minRows={2}
                        inputProps={{ maxLength: 30 }}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                  </div>
                </div>
              </div>
              <>
                <div className="row mt-2">
                  <Box sx={{ width: '100%' }}>
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      textColor="secondary"
                      indicatorColor="secondary"
                      aria-label="secondary tabs example"
                    >
                      <Tab value={0} label="Account Particulars" />
                      <Tab value={1} label="Total Summary" />
                    </Tabs>
                  </Box>
                  <Box sx={{ padding: 2 }}>
                    {value === 0 && (
                      <>
                        <div className="row d-flex ml">
                          <div className="mb-1">
                            <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                          </div>
                          <div className="row mt-2">
                            <div className="col-lg-12">
                              <div className="table-responsive">
                                <table className="table table-bordered ">
                                  <thead>
                                    <tr style={{ backgroundColor: '#673AB7' }}>
                                      <th className="table-header">Action</th>
                                      <th className="table-header">S.No</th>
                                      <th className="table-header">Account Name</th>
                                      <th className="table-header">Sub Ledger Name</th>
                                      <th className="table-header">Sub Ledger Code</th>
                                      <th className="table-header">Debit</th>
                                      <th className="table-header">Credit</th>
                                      <th className="table-header">Narration</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {detailsTableData.map((row, index) => (
                                      <tr key={row.id}>
                                        <td className="border px-2 py-2 text-center">
                                          <ActionButton
                                            title="Delete"
                                            icon={DeleteIcon}
                                            onClick={() =>
                                              handleDeleteRow(
                                                row.id,
                                                detailsTableData,
                                                setDetailsTableData,
                                                detailsTableErrors,
                                                setDetailsTableErrors
                                              )
                                            }
                                          />
                                        </td>
                                        <td className="text-center">
                                          <div className="pt-2">{index + 1}</div>
                                        </td>

                                        <Autocomplete
                                          disablePortal
                                          options={allAccountName}
                                          getOptionLabel={(option) => option.accountName}
                                          size="small"
                                          value={row.accountName ? allAccountName.find((a) => a.accountName === row.accountName) : null}
                                          onChange={(event, newValue) => {
                                            const value = newValue ? newValue.accountName : '';
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, accountName: value } : r))
                                            );
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              label="Account Name"
                                              variant="outlined"
                                              error={!!detailsTableErrors[index]?.accountName}
                                              helperText={detailsTableErrors[index]?.accountName}
                                              InputProps={{
                                                ...params.InputProps,
                                                className: detailsTableErrors[index]?.accountName ? 'error form-control' : 'form-control'
                                              }}
                                            />
                                          )}
                                        />
                                        <td className="border px-2 py-2">
                                          <input
                                            value={row.subledgerName}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setDetailsTableData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, subledgerName: value } : r))
                                              );
                                              setDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  subledgerName: !value ? 'Sub Ledger Name is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={detailsTableErrors[index]?.subledgerName ? 'error form-control' : 'form-control'}
                                          />
                                          {detailsTableErrors[index]?.subledgerName && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {detailsTableErrors[index].subledgerName}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            value={row.subLedgerCode}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setDetailsTableData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, subLedgerCode: value } : r))
                                              );
                                              setDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  subLedgerCode: !value ? 'Sub Ledger Code is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={detailsTableErrors[index]?.subLedgerCode ? 'error form-control' : 'form-control'}
                                          />
                                          {detailsTableErrors[index]?.subLedgerCode && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {detailsTableErrors[index].subLedgerCode}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            value={row.debit}
                                            onChange={(e) => handleDebitChange(e, row, index)}
                                            maxLength="20"
                                            className={detailsTableErrors[index]?.debit ? 'error form-control' : 'form-control'}
                                            helperText={
                                              <span style={{ color: 'red' }}>
                                                {detailsTableErrors.debit ? detailsTableErrors.debit : ''}
                                              </span>
                                            }
                                            error={!!detailsTableErrors.debit}
                                          />
                                          {/* {detailsTableErrors[index]?.debit && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {detailsTableErrors[index].debit}
                                            </div>
                                          )} */}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            value={row.credit}
                                            onChange={(e) => handleCreditChange(e, row, index)}
                                            maxLength="20"
                                            className={detailsTableErrors[index]?.credit ? 'error form-control' : 'form-control'}
                                          />
                                          {detailsTableErrors[index]?.credit && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {detailsTableErrors[index].credit}
                                            </div>
                                          )}
                                        </td>

                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.narration}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setDetailsTableData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, narration: value } : r))
                                              );
                                              setDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  narration: !value ? 'Narration is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={detailsTableErrors[index]?.narration ? 'error form-control' : 'form-control'}
                                          />
                                          {detailsTableErrors[index]?.narration && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {detailsTableErrors[index].narration}
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
                    {value === 1 && (
                      <>
                        <div className="row mt-2">
                          <div className="col-md-3 mb-3">
                            <TextField
                              id="outlined-textarea-zip"
                              label="Total Debit Amount"
                              variant="outlined"
                              size="small"
                              fullWidth
                              name="totaldebit"
                              value={formData.totalDebitAmount}
                              onChange={handleInputChange}
                              disabled
                              helperText={
                                <span style={{ color: 'red' }}>{fieldErrors.totalDebitAmount ? fieldErrors.totalDebitAmount : ''}</span>
                              }
                              inputProps={{ maxLength: 40 }}
                            />
                          </div>
                          <div className="col-md-3 mb-3">
                            <TextField
                              id="outlined-textarea-zip"
                              label="Total Credit Amount"
                              variant="outlined"
                              size="small"
                              fullWidth
                              name="totalCreditAmount"
                              value={formData.totalCreditAmount}
                              onChange={handleInputChange}
                              disabled
                              helperText={
                                <span style={{ color: 'red' }}>{fieldErrors.totalCreditAmount ? fieldErrors.totalCreditAmount : ''}</span>
                              }
                              inputProps={{ maxLength: 40 }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </Box>
                </div>
              </>
            </>
          ) : (
            <CommonTable data={data} columns={listViewColumns} blockEdit={true} toEdit={getAllContraVoucherById} />
          )}
        </div>
      </div>
    </>
  );
};

export default ContraVoucher;
