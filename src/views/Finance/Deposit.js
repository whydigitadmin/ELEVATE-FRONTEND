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

const Deposit = () => {
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
    depositMode: '',
    // docId: '',
    docDate: dayjs(),
    receivedFrom: '',
    chequeNo: '',
    chequeDate: dayjs(),
    chequeBank: '',
    bankName: '',
    currency: '',
    exRate: '',
    depositAmount: '',
    totalCreditAmount: 0,
    totalDebitAmount: 0,
    totalAmount: 0,
    remarks: ''
  });
  const [fieldErrors, setFieldErrors] = useState({
    depositMode: '',
    // docId: '',
    docDate: new Date(),
    receivedFrom: '',
    chequeNo: '',
    chequeDate: '',
    chequeBank: '',
    bankName: '',
    currency: '',
    exRate: '',
    depositAmount: 0,
    totalCreditAmount: 0,
    totalDebitAmount: 0,
    totalAmount: 0,
    remarks: ''
  });
  const [detailsTableData, setDetailsTableData] = useState([
    {
      id: 1,
      accountName: '',
      debit: '',
      credit: '',
      narration: ''
    }
  ]);

  const [detailsTableErrors, setDetailsTableErrors] = useState([
    {
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
      // orgId: orgId,
      depositMode: '',
      // docId: '',
      docDate: dayjs(),
      receivedFrom: '',
      chequeNo: '',
      chequeDate: dayjs(),
      chequeBank: '',
      bankName: '',
      currency: '',
      exRate: '',
      depositAmount: '',
      totalCreditAmount: '',
      totalDebitAmount: '',
      totalAmount: '',
      remarks: ''
    });
    getAllActiveCurrency(orgId);
    setFieldErrors({
      // orgId: orgId,
      depositMode: '',
      // docId: '',
      docDate: dayjs(),
      receivedFrom: '',
      chequeNo: '',
      chequeDate: dayjs(),
      chequeBank: '',
      bankName: '',
      currency: '',
      exRate: '',
      depositAmount: '',
      totalCreditAmount: '',
      totalDebitAmount: '',
      totalAmount: '',
      remarks: ''
    });
    setDetailsTableData([{ id: 1, accountName: '', debit: '', credit: '', narration: '' }]);
    setDetailsTableErrors('');
    setEditId('');
    getDepositDocId();
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
      debit: '',
      credit: '',
      narration: ''
    };
    setDetailsTableData([...detailsTableData, newRow]);
    setDetailsTableErrors([...detailsTableErrors, { accountName: '', debit: '', credit: '', narration: '' }]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === detailsTableData) {
      return !lastRow.accountName || !lastRow.credit || !lastRow.debit || !lastRow.narration;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === detailsTableData) {
      setDetailsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          accountName: !table[table.length - 1].accountName ? 'Account Name is required' : '',
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
        const currencyData = await getAllActiveCurrency(orgId);
        setCurrencies(currencyData);
        console.log('currency', currencyData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };

    fetchData();
    getDepositDocId();
    getAllDepositByOrgId();
    getAllbankName();
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

  const getDepositDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/transaction/getBankingDepositDocId?branchCode=${branchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
      );
      console.log('docid working');

      setDocId(response.paramObjectsMap.bankingDepositDocId);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getAllDepositByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/transaction/getAllBankingDepositByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.bankingDepositVO || []);
      // showForm(true);
      console.log('bankingDepositVO', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getAllDepositById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/transaction/getBankingDepositById?id=${row.original.id}`);

      if (result) {
        const DepVO = result.paramObjectsMap.bankingDepositVO[0];
        setEditId(row.original.id);
        setDocId(DepVO.docId);
        setFormData({
          depositMode: DepVO.depositMode,
          // id: DepVO.id,
          docDate: DepVO.docDate ? dayjs(DepVO.docDate, 'YYYY-MM-DD') : dayjs(),
          // docId: DepVO.docId,
          receivedFrom: DepVO.receivedFrom,
          chequeNo: DepVO.chequeNo,
          chequeDate: DepVO.chequeDate ? dayjs(DepVO.chequeDate, 'YYYY-MM-DD') : dayjs(),
          chequeBank: DepVO.chequeBank,
          bankName: DepVO.bankAccount,
          currency: DepVO.currency,
          exRate: DepVO.exchangeRate,
          depositAmount: DepVO.depositAmount,
          totalAmount: DepVO.totalAmount,
          remarks: DepVO.remarks,
          orgId: DepVO.orgId,
          totalDebitAmount: DepVO.totalDebitAmount,
          totalCreditAmount: DepVO.totalCreditAmount
          // active: DepVO.active || false,
        });
        setDetailsTableData(
          DepVO.depositparticularsVO.map((row) => ({
            id: row.id,
            accountName: row.accountsName,
            debit: row.debit,
            credit: row.credit,
            narration: row.narration
          }))
        );

        console.log('DataToEdit', DepVO);
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
    if (!formData.chequeBank) {
      errors.chequeBank = 'Cheque Bank is required';
    }
    if (!formData.remarks) {
      errors.remarks = 'Remarks is required';
    }
    if (!formData.depositMode) {
      errors.depositMode = 'Deposit Mode is required';
    }
    if (!formData.depositAmount) {
      errors.depositAmount = 'Deposit Amount is required';
    }
    if (!formData.receivedFrom) {
      errors.receivedFrom = 'Received From is required';
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
      // if (!row.credit) {
      //   rowErrors.credit = 'Credit is required';
      //   detailTableDataValid = false;
      // }
      // if (!row.debit) {
      //   rowErrors.debit = 'Debit is required';
      //   detailTableDataValid = false;
      // }
      if (!row.credit && !row.debit) {
        rowErrors.credit = 'Credit or Debit is required';
        rowErrors.debit = 'Credit or Debit is required';
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
      const depositVO = detailsTableData.map((row) => ({
        ...(editId && { id: row.id }),
        accountsName: row.accountName,
        credit: row.credit,
        debit: row.debit,
        narration: row.narration
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        // active: formData.active,
        branch: branch,
        branchCode: branchCode,
        createdBy: loginUserName,
        finYear: finYear,
        orgId: orgId,
        depositParticularsDTO: depositVO,
        bankAccount: formData.bankName,
        currency: formData.currency,
        exchangeRate: parseInt(formData.exRate),
        depositAmount: parseInt(formData.depositAmount),
        depositMode: formData.depositMode,
        receivedFrom: formData.receivedFrom,
        chequeNo: formData.chequeNo,
        chequeDate: dayjs(formData.chequeDate).format('YYYY-MM-DD'),
        chequeBank: formData.chequeBank,
        remarks: formData.remarks
        // totalCreditAmount: formData.totalCreditAmount,
        // totalDebitAmount: formData.totalDebitAmount
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `/transaction/updateCreateBankingDeposit`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Deposit Updated Successfully' : 'Deposit Created successfully');
          getAllDepositByOrgId();
          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.message || 'Deposit creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Deposit creation failed');
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const getAllbankName = async () => {
    try {
      const response = await apiCalls('get', `/transaction/getBankNameFromGroupforBankingDeposit?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setAllbankName(response.paramObjectsMap.BankingDeposit);
        console.log('bankName', response.paramObjectsMap.BankingDeposit);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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
    // const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  // const handleInputChange = (e) => {
  //   const { name, value, checked, selectionStart, selectionEnd, type } = e.target;

  //   let errorMessage = '';

  //   if (errorMessage) {
  //     setFieldErrors({ ...fieldErrors, [name]: errorMessage });
  //   } else {
  //     setFormData({ ...formData, [name]: value.toUpperCase() });

  //     setFieldErrors({ ...fieldErrors, [name]: '' });

  //     // Preserve the cursor position for text-based inputs
  //     if (type === 'text' || type === 'textarea') {
  //       setTimeout(() => {
  //         const inputElement = document.getElementsByName(name)[0];
  //         if (inputElement && inputElement.setSelectionRange) {
  //           inputElement.setSelectionRange(selectionStart, selectionEnd);
  //         }
  //       }, 0);
  //     }
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd, type } = e.target;
    let errorMessage = '';

    switch (name) {
      case 'exRate':
        if (isNaN(value)) errorMessage = 'Invalid format';
        break;
      case 'chequeBank':
        if (!/^[A-Za-z\s]+$/.test(value)) errorMessage = 'Invalid format';
        break;
      case 'depositAmount':
        if (isNaN(value)) {
          errorMessage = 'Invalid format';
        }
        break;
      case 'chequeNo':
        if (!/^\d{6,12}$/.test(value)) {
          errorMessage = 'Invalid format';
        }
        break;
      case 'credit':
        if (isNaN(value) || value <= 0) {
          errorMessage = 'Invalid format';
        }
        break;
      case 'debit':
        if (isNaN(value) || value <= 0) {
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
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.depositMode}>
                    <InputLabel id="depositMode">Deposite Mode</InputLabel>
                    <Select
                      labelId="depositMode"
                      label="Deposite Mode"
                      value={formData.depositMode}
                      onChange={handleInputChange}
                      name="depositMode"
                    >
                      <MenuItem value="BANK RECEIPT">BANK RECEIPT</MenuItem>
                      <MenuItem value="CASH RECEIPT">CASH RECEIPT</MenuItem>
                    </Select>
                    {fieldErrors.depositMode && <FormHelperText>{fieldErrors.depositMode}</FormHelperText>}
                  </FormControl>
                </div>
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
                    id="receivedFrom"
                    label={
                      <span>
                        Received From <span className="asterisk">*</span>
                      </span>
                    }
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="receivedFrom"
                    value={formData.receivedFrom}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.receivedFrom ? fieldErrors.receivedFrom : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.receivedFrom}
                  />
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
                  <TextField
                    id="chequeBank"
                    label={
                      <span>
                        Cheque Bank <span className="asterisk">*</span>
                      </span>
                    }
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="chequeBank"
                    value={formData.chequeBank}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.chequeBank ? fieldErrors.chequeBank : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.chequeBank}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={allbankName}
                    // getOptionLabel={(option) => option.bankName}
                    getOptionLabel={(option) => option?.bankName || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.bankName ? allbankName.find((c) => c.bankName === formData.bankName) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'bankName',
                          value: newValue ? newValue.bankName : ''
                        }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={
                          <span>
                            Bank Account <span className="asterisk">*</span>
                          </span>
                        }
                        name="bankName"
                        error={!!fieldErrors.bankName}
                        helperText={fieldErrors.bankName ? fieldErrors.bankName : ''}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 }
                        }}
                      />
                    )}
                  />
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
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="depositAmount"
                    label={
                      <span>
                        Deposit Amount <span className="asterisk">*</span>
                      </span>
                    }
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="depositAmount"
                    value={formData.depositAmount}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.depositAmount ? fieldErrors.depositAmount : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
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

                                        {/* <td className="border px-2 py-2"> */}

                                        {/* {detailsTableErrors[index]?.accountName && (
                                             <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {detailsTableErrors[index].accountName}
                                              </div> 
                                          )} */}

                                        {/* <Autocomplete
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
                                                name="accountName"
                                                error={!!detailsTableErrors[index]?.accountName}
                                                helperText={detailsTableErrors[index]?.accountName}
                                                InputProps={{
                                                  ...params.InputProps,
                                                  className: detailsTableErrors[index]?.accountName ? 'error form-control' : 'form-control'
                                                }}
                                              />
                                            )}
                                          />

                                           {detailsTableErrors[index]?.accountName && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {detailsTableErrors[index].accountName}
                                            </div>
                                          )} */}

                                        {/* </td> */}

                                        <td className="border px-2 py-2">
                                          <input
                                            value={row.debit}
                                            onChange={(e) => handleDebitChange(e, row, index)}
                                            maxLength="20"
                                            className={detailsTableErrors[index]?.debit ? 'error form-control' : 'form-control'}
                                          />
                                          {detailsTableErrors[index]?.debit && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {detailsTableErrors[index].debit}
                                            </div>
                                          )}
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
                          <div className="col-md-3 mb-3">
                            <TextField
                              id="outlined-textarea-zip"
                              label="Total Amount"
                              variant="outlined"
                              size="small"
                              fullWidth
                              name="totalAmount"
                              value={formData.totalAmount}
                              onChange={handleInputChange}
                              disabled
                              helperText={<span style={{ color: 'red' }}>{fieldErrors.totalAmount ? fieldErrors.totalAmount : ''}</span>}
                              inputProps={{ maxLength: 40 }}
                            />
                          </div>
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
                      </>
                    )}
                  </Box>
                </div>
              </>
            </>
          ) : (
            <CommonTable data={data} columns={listViewColumns} blockEdit={true} toEdit={getAllDepositById} />
          )}
        </div>
      </div>
    </>
  );
};

export default Deposit;
