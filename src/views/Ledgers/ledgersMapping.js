import React, { useEffect, useRef, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import GridOnIcon from '@mui/icons-material/GridOn';
import { Autocomplete, FormControl, TextField } from '@mui/material';
import ActionButton from 'utils/ActionButton';
import apiCalls from 'apicall';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommonTable from 'views/basicMaster/CommonTable';
import { showToast } from 'utils/toast-component';

const LedgersMapping = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    rows: [
      {
        clientCoa: '',
        clientCoaCode: '',
        coa: '',
        coaCode: '',
        active: true,
        clientCode: '',
      },
    ],
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [allCOA, setAllCOA] = useState([]);
  const [editId, setEditId] = useState('');
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));

  useEffect(() => {
    if (loginUserName) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        rows: prevFormData.rows.map((row) => ({
          ...row,
          clientCode: loginUserName,
        })),
      }));
    }

    getAllLedgerMapping();
    getCOALedgersMapping();
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
      const response = await apiCalls('get', `/businesscontroller/getCOAForLedgerMapping`);
      if (response.status === true) {
        setAllCOA(response.paramObjectsMap.ledgerMappingVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getLedgersMappingById = async (row) => {
    console.log('Editing Exchange Rate:', row.original.id);
    setEditId(row.original.id);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/businesscontroller/getLedgerMappingbyId?id=${row.original.id}`);
      if (result) {
        const ledgers = result.paramObjectsMap.ledgerMappingVO;
        setEditMode(true);

        setFormData({
          rows: [
            {
              clientCoa: ledgers.clientCoa || '',
              clientCoaCode: ledgers.clientCoaCode || '',
              coa: ledgers.coa || '',
              coaCode: ledgers.coaCode || '',
              active: true,
              clientCode: ledgers.clientCode || '',
            },
          ],
        });

        console.log('DataToEdit', ledgers);
      } else {
        console.error('No data found for the given ID');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleListView = () => {
    setShowForm(!showForm);
    setFieldErrors({});
  };

  const columns = [
    { accessorKey: 'clientCoa', header: 'Client COA', size: 140 },
    { accessorKey: 'clientCoaCode', header: 'CCOA Code', size: 100 },
    { accessorKey: 'coa', header: 'COA', size: 140 },
    { accessorKey: 'coaCode', header: 'COA Code', size: 100 }
  ];

  const handleSave = async () => {
    const errors = {};

    formData.rows.forEach((rows, index) => {
      if (!rows.coa) {
        errors[`coa-${index}`] = 'COA is required';
      }
    });

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      const saveData = formData.rows.map((rows) => ({
        id: rows.id || editId,
        active: rows.active,
        clientCoa: rows.clientCoa,
        clientCoaCode: rows.clientCoaCode,
        clientCode: loginUserName,
        coa: rows.coa,
        coaCode: rows.coaCode,
        createdBy: loginUserName,
      }));

      try {
        const response = await apiCalls('put', '/businesscontroller/createUpdateLedgerMapping', saveData);
        if (response.status === true) {
          showToast('success', editId ? 'Ledgers Mapping updated successfully' : 'Ledgers Mapping created successfully');
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
    } else {
      setFieldErrors(errors);
    }
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedRows = [...formData.rows];
    updatedRows[index] = {
      ...updatedRows[index],
      [name]: value,
    };

    setFormData({
      ...formData,
      rows: updatedRows,
    });
  };

  const handleClear = () => {
    setFormData({
      rows: [
        {
          clientCoa: '',
          clientCoaCode: '',
          coa: '',
          coaCode: '',
          active: true,
          clientCode: '',
        },
      ],
    });
    setFieldErrors({});
  };

  const handleFillGrid = async () => {
    console.log('Editing Exchange Rate:', loginUserName);

    const clientCode = loginUserName;
    setEditId(clientCode);
    setShowForm(true);

    try {
      const result = await apiCalls('get', `/businesscontroller/getFillGridForLedgerMapping?clientCode=${clientCode}`);

      if (result && result.paramObjectsMap && result.paramObjectsMap.COA) {
        const fillGrid = result.paramObjectsMap.COA;
        setEditMode(true);

        setFormData((prevFormData) => ({
          ...prevFormData,
          rows: [
            {
              ...prevFormData.rows[0],
              clientCoa: fillGrid.clientCoa || '',
              clientCoaCode: fillGrid.clientCoaCode || '',
              coa: fillGrid.coa || '',
              coaCode: fillGrid.coaCode || '',
            },
          ],
        }));

        console.log('DataToEdit:', fillGrid);
      } else {
        console.error('No valid data received from the API');
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
          <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} />
          <ActionButton title="Fill Grid" icon={GridOnIcon} onClick={handleFillGrid} />
        </div>
        {showForm ? (
          <div className="row d-flex">
            {formData.rows.map((row, index) => (
              <div key={index} className="row d-flex">

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      label="Client COA"
                      size="small"
                      required
                      onChange={(e) => handleInputChange(index, e)}
                      name="clientCoa"
                      value={row.clientCoa}
                      error={!!fieldErrors[`clientCoa-${index}`]}
                      helperText={fieldErrors[`clientCoa-${index}`] || ''}
                    />
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      label="Client COA Code"
                      size="small"
                      required
                      onChange={(e) => handleInputChange(index, e)}
                      name="clientCoaCode"
                      value={row.clientCoaCode}
                      error={!!fieldErrors[`clientCoaCode-${index}`]}
                      helperText={fieldErrors[`clientCoaCode-${index}`] || ''}
                    />
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <Autocomplete
                    options={allCOA}
                    getOptionLabel={(option) => option.accountGroupName || ''}
                    value={allCOA.find((item) => item.accountGroupName === row.coa) || null}
                    onChange={(event, newValue) => {
                      const updatedRows = [...formData.rows];
                      updatedRows[index].coa = newValue ? newValue.accountGroupName : '';
                      setFormData({ ...formData, rows: updatedRows });
                    }}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="COA"
                        variant="outlined"
                        error={!!fieldErrors.coa}
                        helperText={fieldErrors.coa || ''}
                      />
                    )}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      label="COA Code"
                      size="small"
                      required
                      onChange={(e) => handleInputChange(index, e)}
                      name="coaCode"
                      value={row.coaCode}
                      error={!!fieldErrors[`coaCode-${index}`]}
                      helperText={fieldErrors[`coaCode-${index}`] || ''}
                    />
                  </FormControl>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <CommonTable columns={columns} data={data} blockEdit={true} toEdit={getLedgersMappingById} />
        )}
      </div>
    </>
  );
};

export default LedgersMapping;
