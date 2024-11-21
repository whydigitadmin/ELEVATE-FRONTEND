import React, { useEffect, useState } from 'react';
import { Checkbox, Container, FormControlLabel, Grid, TextField, MenuItem } from '@mui/material';
import { LocalizationProvider, ClearIcon } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import enUS from 'date-fns/locale/en-US';
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
        clintAdminName: '',
        clientMail: '',
        clientType: '',
        phoneNo: '',
        active: ''
    });
    const [formData, setFormData] = useState({
        clientCode: '',
        client: '',
        clintAdminName: '',
        clientMail: '',
        clientType: '',
        phoneNo: '',
        active: ''
    });
    const listViewColumns = [
        { accessorKey: 'clientCode', header: 'Code', size: 140 },
        { accessorKey: 'client', header: 'Client Name', size: 140 },
        {
            accessorKey: 'clintAdminName',
            header: 'Admin Name',
            size: 140
        },
        { accessorKey: 'clientMail', header: 'Client Mail Id', size: 140 },
        { accessorKey: 'clientType', header: 'Client Type', size: 140 },
        { accessorKey: 'phoneNo', header: 'Phone Number', size: 140 },
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
            clintAdminName: '',
            clientMail: '',
            clientType: '',
            phoneNo: '',
            active: true
        });
        setFieldErrors({
            clientCode: '',
            client: '',
            clintAdminName: '',
            clientMail: '',
            clientType: '',
            phoneNo: '',
            active: '',
        });
        setEditId('');
    };

    const handleInputChange = (field, value) => {
        // Convert email to lowercase if the field is 'clientMail'
        const formattedValue = field === 'clientMail' ? value.toLowerCase() : value;
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
                    clintAdminName: particularClient.clintAdminName,
                    clientMail: particularClient.clientMail,
                    clientType: particularClient.clientType,
                    phoneNo: particularClient.phoneNo,
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
        if (!formData?.clientCode) {
            errors.clientCode = 'Code is required';
        }
        if (!formData?.client) {
            errors.client = 'Client Name is required';
        }
        if (!formData?.clintAdminName) {
            errors.clintAdminName = 'Admin Name is required';
        }
        if (!formData?.clientMail) {
            errors.clientMail = 'Client Mail Id is required';
        }
        if (!formData?.clientType) {
            errors.clientType = 'Client Type is required';
        }
        if (!formData?.phoneNo) {
            errors.phoneNo = 'Phone Number is required';
        }

        if (Object.keys(errors).length === 0) {
            setIsLoading(true);
            const saveFormData = {
                ...(editId && { id: editId }),
                active: true,
                cancel: true,
                clientCode: formData.clientCode,
                client: formData.client,
                clintAdminName: formData.clintAdminName,
                clientMail: formData.clientMail,
                clientType: formData.clientType,
                phoneNo: formData.phoneNo,
                contactPerson: '',
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
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={enUS}>
                <Container
                    maxWidth="lg"
                    sx={{
                        padding: '30px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                    }}
                >
                    <form style={{ width: '100%' }}>
                        {/* Top Button Actions */}
                        <Container sx={{ display: 'flex' }}>
                            <ActionButton icon={SearchIcon} title='search' />
                            <ActionButton icon={ClearIcon} title='Clear' onClick={handleClear} />
                            <ActionButton icon={FormatListBulletedTwoToneIcon} title='List View' onClick={handleView} />
                            <ActionButton icon={SaveIcon} title='Save' onClick={handleDataSubmit} disabled={isLoading} />

                        </Container>

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
                            <Container
                                maxWidth="lg"
                                sx={{
                                    padding: '30px',
                                    backgroundColor: 'white',
                                    borderRadius: '8px',
                                }}
                            >
                                {/* Editable Form */}
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            label="Code"
                                            fullWidth
                                            required
                                            value={formData.clientCode}
                                            onChange={(e) => handleInputChange('clientCode', e.target.value)}
                                            error={!!fieldErrors.clientCode}
                                            helperText={fieldErrors.clientCode}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            label="Client Name"
                                            fullWidth
                                            required
                                            value={formData.client}
                                            onChange={(e) => handleInputChange('client', e.target.value)}
                                            error={!!fieldErrors.client}
                                            helperText={fieldErrors.client}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            label="Client Access"
                                            fullWidth
                                            select
                                            required
                                            value={formData.clintAdminName}
                                            onChange={(e) => handleInputChange('clintAdminName', e.target.value)}
                                            error={!!fieldErrors.clintAdminName}
                                            helperText={fieldErrors.clintAdminName}
                                        >
                                        <MenuItem value="PRODUCT_OWNER">PRODUCT_OWNER</MenuItem>
                                            <MenuItem value="ADMIN">ADMIN</MenuItem>
                                            <MenuItem value="USER">USER</MenuItem>
                                            <MenuItem value="GUEST USER">GUEST USER</MenuItem>
                                            </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            label="Client Email Id"
                                            type="email"
                                            fullWidth
                                            value={formData.clientMail}
                                            onChange={(e) => handleInputChange('clientMail', e.target.value)}
                                            error={!!fieldErrors.clientMail}
                                            helperText={fieldErrors.clientMail}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            label="client Type"
                                            required
                                            select
                                            fullWidth
                                            value={formData.clientType}
                                            onChange={(e) => handleInputChange('clientType', e.target.value)}
                                            error={!!fieldErrors.clientMail}
                                            helperText={fieldErrors.clientMail}
                                        >
                                            <MenuItem value="PRODUCT_OWNER">PRODUCT_OWNER</MenuItem>
                                            <MenuItem value="ADMIN">ADMIN</MenuItem>
                                            <MenuItem value="USER">USER</MenuItem>
                                            <MenuItem value="GUEST USER">GUEST USER</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            label="Phone Number"
                                            required
                                            fullWidth
                                            value={formData.phoneNo}
                                            onChange={(e) => handleInputChange('phoneNo', e.target.value)}
                                            error={!!fieldErrors.phoneNo}
                                            helperText={fieldErrors.phoneNo}
                                        />
                                    </Grid>
                                    <FormControlLabel
                                        control={<Checkbox defaultChecked size='large' />}
                                        label="Active"
                                        sx={{ 
                                            marginTop: '15px',
                                            marginLeft: '15px'
                                        }}
                                    />
                                </Grid>
                            </Container>
                        )}
                    </form>
                </Container >
            </LocalizationProvider >
            <ToastComponent />
        </>
    );
};

export default CreateClient;