import React, { useEffect, useState } from 'react';
import { Checkbox, Container, FormControlLabel, Grid, TextField, MenuItem } from '@mui/material';
import { ClearIcon } from '@mui/x-date-pickers';
import { ToastContainer } from 'react-toastify';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import CommonListViewTable from '../basicMaster/CommonListViewTable';
import ToastComponent, { showToast } from 'utils/toast-component';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import apiCalls from 'apicall';
import { encryptPassword } from 'views/utilities/encryptPassword';
import ActionButton from 'utils/ActionButton';

const CreateClient = () => {
    const [listView, setListView] = useState(false);
    const [listViewData, setListViewData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [editId, setEditId] = useState('');
    const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
    const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
    const [fieldErrors, setFieldErrors] = useState({
        clientCode: '',
        client: '',
        clientMail: '',
        phoneNo: '',
        clientType: '',
        active: ''
    });
    const [formData, setFormData] = useState({
        clientCode: '',
        client: '',
        clientMail: '',
        phoneNo: '',
        clientType: '',
        active: ''
    });
    const listViewColumns = [
        { accessorKey: 'clientCode', header: 'Code', size: 140 },
        { accessorKey: 'client', header: 'Client Name', size: 140 },
        { accessorKey: 'clientMail', header: 'Client Mail Id', size: 140 },
        { accessorKey: 'phoneNo', header: 'Phone Number', size: 140 },
        { accessorKey: 'clientType', header: 'Type', size: 140 },
        { accessorKey: 'active', header: 'Active', size: 140 }
    ];

    useEffect(() => {
        getAllClients();
    }, []);
    const getAllClients = async () => {
        try {
            const response = await apiCalls('get', `commonmaster/getAllClients?orgId=${orgId}`);
            console.log('API Response:', response);

            if (response.status === true) {
                setListViewData(response.paramObjectsMap.clientVOs);
            } else {
                console.error('API Error:', response);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleClear = () => {
        setFormData({
            clientCode: '',
            client: '',
            clientMail: '',
            phoneNo: '',
            clientType: '',
            active: true
        });
        setFieldErrors({
            clientCode: '',
            client: '',
            clientMail: '',
            phoneNo: '',
            clientType: '',
            active: '',
        });
        setEditId('');
    };

    const handleInputChange = (field, value) => {
        let formattedValue = value;
    
        if (field === 'clientCode' || field === 'client') {
            formattedValue = value.toUpperCase();
        } else if (field === 'clientMail') {
            const emailRegex = /^[a-z0-9.@]*$/;
            formattedValue = value.toLowerCase();
    
            if (!emailRegex.test(value)) {
                return;
            }
        } else if (field === 'phoneNo') {
            formattedValue = value.replace(/\D/g, '').slice(0, 10);
        }
    
        setFormData((prevState) => ({ ...prevState, [field]: formattedValue }));
    };

    const getClientById = async (row) => {
        console.log('THE SELECTED Client ID IS:', row.original.id);
        setEditId(row.original.id);
        try {
            const response = await apiCalls('get', `commonmaster/getClientById?id=${row.original.id}`);
            console.log('API Response:', response);

            if (response.status === true) {
                setListView(false);
                const particularClient = response.paramObjectsMap.clientVOs;
                console.log('THE PARTICULAR CLIENT DETAILS ARE:', particularClient);

                setFormData({
                    clientCode: particularClient.clientCode,
                    client: particularClient.client,
                    clientMail: particularClient.clientMail,
                    phoneNo: particularClient.phoneNo,
                    clientType: particularClient.clientType,
                    active: particularClient.active === 'Active',
                });
            } else {
                console.error('API Error:', response);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleDataSubmit = async () => {
        const errors = {};
        if (!formData.clientCode) {
            errors.clientCode = 'Code is required';
        }
        if (!formData.client) {
            errors.client = 'Name is required';
        }
        if (!formData.clientMail) {
            errors.clientMail = 'Email is required';
        }
        if (!formData.phoneNo) {
            errors.phoneNo = 'Phone Number is required';
        }
        if (!formData.clientType) {
            errors.clientType = 'Type is required';
        }

        if (Object.keys(errors).length === 0) {
            setIsLoading(true);
            const saveFormData = {
                ...(editId && { id: editId }),
                active: true,
                cancel: true,
                client: formData.client,
                clientCode: formData.clientCode,
                clientMail: formData.clientMail,
                phoneNo: formData.phoneNo,
                clientType: formData.clientType,
                orgId: orgId,
                password: encryptPassword('Test@123'),
                createdBy: loginUserName,
                userName: ''
            };

            console.log('DATA TO SAVE IS:', saveFormData);

            try {
                const response = await apiCalls('put', `commonmaster/createUpdateClient`, saveFormData);
                if (response.status === true) {
                    console.log('Response:', response);
                    showToast('success', editId ? ' Client page Updated Successfully' : 'Client page created successfully');
                    handleClear();
                    getAllClients();
                    setIsLoading(false);
                } else {
                    showToast('error', response.paramObjectsMap.errorMessage || 'Client creation failed');
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('error', 'Client creation failed');
                setIsLoading(false);
            }
        } else {
            setFieldErrors(errors);
        }
    };

    const handleView = () => {
        setListView(!listView);
    };

    return (
        <>
            <ToastContainer />
            <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
                {/* <LocalizationProvider dateAdapter={AdapterDateFns} locale={enUS}> */}

                <form style={{ width: '100%' }}>
                    {/* Top Button Actions */}
                    {/* <Container sx={{ display: 'flex' }}> */}
                    <ActionButton icon={SearchIcon} title='search' />
                    <ActionButton icon={ClearIcon} title='Clear' onClick={handleClear} />
                    <ActionButton icon={FormatListBulletedTwoToneIcon} title='List View' onClick={handleView} />
                    <ActionButton icon={SaveIcon} title='Save' onClick={handleDataSubmit} disabled={isLoading} />

                    {/* </Container> */}

                    {/* ListView or Form */}
                    {listView ? (
                        <div className="mt-4">
                            <CommonListViewTable
                                data={listViewData}
                                columns={listViewColumns}
                                blockEdit={true}
                                toEdit={getClientById}
                            />
                        </div>
                    ) : (
                        <>
                            <div className="row mt-4">
                                {/* Editable Form */}
                                <div className="col-md-3 mb-3">
                                    <TextField
                                        label="Code"
                                        size="small"
                                        fullWidth
                                        value={formData.clientCode}
                                        onChange={(e) => handleInputChange('clientCode', e.target.value)}
                                        error={!!fieldErrors.clientCode}
                                        helperText={fieldErrors.clientCode}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <TextField
                                        label="Name"
                                        size="small"
                                        fullWidth
                                        value={formData.client}
                                        onChange={(e) => handleInputChange('client', e.target.value)}
                                        error={!!fieldErrors.client}
                                        helperText={fieldErrors.client}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <TextField
                                        label="Email"
                                        size="small"
                                        type="email"
                                        fullWidth
                                        value={formData.clientMail}
                                        onChange={(e) => handleInputChange('clientMail', e.target.value)}
                                        error={!!fieldErrors.clientMail}
                                        helperText={fieldErrors.clientMail}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <TextField
                                        label="Phone Number"
                                        size="small"
                                        fullWidth
                                        value={formData.phoneNo}
                                        onChange={(e) => handleInputChange('phoneNo', e.target.value)}
                                        error={!!fieldErrors.phoneNo}
                                        helperText={fieldErrors.phoneNo}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                        <TextField
                                            label="Type"
                                            size="small"
                                            value={formData.clientType}
                                            select
                                            onChange={(e) => handleInputChange('clientType', e.target.value)}
                                            error={!!fieldErrors.clientType}
                                            helperText={fieldErrors.clientType}
                                            fullWidth
                                        >
                                            <MenuItem value="ADMIN">ADMIN</MenuItem>
                                            <MenuItem value="USER">USER</MenuItem>
                                            <MenuItem value="GUEST">GUEST</MenuItem>
                                        </TextField>
                                    </div>

                                <div className="col-md-3 mb-2">
                                    <FormControlLabel
                                        className='mb-3'
                                        control={<Checkbox defaultChecked />}
                                        label="Active"

                                    />
                                </div>
                            </div>
                        </>
                    )}
                </form>
                {/* </LocalizationProvider > */}
            </div>
            <ToastComponent />
        </>
    );
};

export default CreateClient;