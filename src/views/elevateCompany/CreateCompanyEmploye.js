import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';
import { encryptPassword } from 'views/utilities/encryptPassword';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
// import { getAllActiveCompanyCode } from 'utils/CommonFunctions';


const CreateClientEmploye = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
    const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
    const [editId, setEditId] = useState('');
    const [formData, setFormData] = useState({
        // companyCode: '',
        employeeCode: '',
        employeeName: '',
        email: '',
        phone: '',
        active: true
    });

    const [fieldErrors, setFieldErrors] = useState({
        // companyCode: '',
        employeeCode: '',
        employeeName: '',
        email: '',
        phone: '',
        active: ''
    });
    const [listView, setListView] = useState(false);
    const listViewColumns = [
        // { accessorKey: 'companyCode', header: 'company Code', size: 140 },
        { accessorKey: 'employeeCode', header: 'employee Code', size: 140 },
        { accessorKey: 'employeeName', header: 'employee Name', size: 140 },
        { accessorKey: 'email', header: 'email', size: 140 },
        { accessorKey: 'phone', header: 'phone', size: 140 },
        { accessorKey: 'active', header: 'Active', size: 140 },
    ];

    const [listViewData, setListViewData] = useState([]);
    // const [allCompanyCode, setAllCompanyCode] = useState([]);
    // const clientType = ['PRODUCT_OWNER','ADMIN','USER','GUEST_USER'];

    useEffect(() => {
        getCompanyEmployeeById();
        // getAllCompanyCode();
    }, []);

    // list method
    const getCompanyEmployeeById = async () => {
        try {
            const result = await apiCalls('get', `companycontroller/getAllCompanyEmployeeByOrgId?orgId=${orgId}`);
            setListViewData(result.paramObjectsMap.companyEmployeeVO.reverse());
            console.log('Test', result);
        } catch (err) {
            console.log('error', err);
        }
    };

    // getAllCompanyCode
    // const getAllCompanyCode = async () => {
    //     try {
    //         const companyCodeData = await getAllActiveCompanyCode();
    //         setAllCompanyCode(companyCodeData);
    //     } catch (error) {
    //         console.error('Error fetching country data:', error);
    //     }
    // };


    // edit method
    const getEmployeById = async (row) => {
        console.log('THE SELECTED Client ID IS:', row.original.id);
        setEditId(row.original.id);
        try {
            // const response = await apiCalls('get', `commonmaster/getClientById/${row.original.id}`);
            const response = await apiCalls('get', `companycontroller/getCompanyEmployeeById?id=${row.original.id}`);

            console.log('API Response:', response);

            if (response.status === true) {
                setListView(false);
                const particularCompany = response.paramObjectsMap.companyEmployeeVO;
                console.log('THE PARTICULAR COMPANY DETAILS ARE:', particularCompany);

                setFormData({
                    // companyCode: particularCompany.companyCode,
                    employeeCode: particularCompany.employeeCode,
                    employeeName: particularCompany.employeeName,
                    email: particularCompany.email,
                    phone: particularCompany.phone,
                    active: particularCompany.active === 'Active' ? true : false
                });
            } else {
                console.error('API Error:', response);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, checked, selectionStart, selectionEnd, type } = e.target;
    
        // Validation regex
        const nameRegex = /^[A-Za-z ]*$/;
        const clientNameRegex = /^[A-Za-z 0-9@_\-*]*$/;
        const emailRegex = /^[a-z0-9.@]*$/;
        const clientCodeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;
    
        if (name === 'clientName' && !clientNameRegex.test(value)) {
            setFieldErrors({ ...fieldErrors, [name]: '' });
            return;
        } else if (name === 'clientCode' && !clientCodeRegex.test(value)) {
            setFieldErrors({ ...fieldErrors, [name]: '' });
            return;
        } else if (name === 'clientAdminName' && !nameRegex.test(value)) {
            setFieldErrors({ ...fieldErrors, [name]: '' });
            return;
        } else if (name === 'phone') {
            const sanitizedValue = value.replace(/[^0-9]/g, '');
            if (sanitizedValue.length > 10) {
                setFieldErrors({ ...fieldErrors, [name]: '' });
                return;
            } else {
                setFieldErrors({ ...fieldErrors, [name]: '' });
            }
        } else if (name === 'email') {
            if (!emailRegex.test(value)) {
                setFieldErrors({ ...fieldErrors, [name]: '' });
                return;
            }
        }
    
        let updatedValue = value;
    
        // Value transformations
        if (name === 'email') {
            updatedValue = updatedValue.toLowerCase(); // Force lowercase for email
        } else if (name === 'webSite') {
            updatedValue = updatedValue.toLowerCase();
        } else if (name === 'phone') {
            updatedValue = value.replace(/[^0-9]/g, ''); // Sanitize non-numeric characters
        } else {
            updatedValue = updatedValue.toUpperCase();
        }
    
        // Update form data
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: updatedValue
            }));
        }
    
        // Clear error if valid
        setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    
        // Update the cursor position after the input change only for text inputs
        if (type === 'text' || type === 'email' || type === 'textarea') {
            setTimeout(() => {
                const inputElement = document.getElementsByName(name)[0];
                if (inputElement) {
                    inputElement.setSelectionRange(selectionStart, selectionEnd);
                }
            }, 0);
        }
    };
    

    const handleClear = () => {
        setFormData({
            // companyCode: '',
            employeeCode: '',
            employeeName: '',
            email: '',
            phone: '',
            active: true
        });
        setFieldErrors({
            // companyCode: '',
            employeeCode: '',
            employeeName: '',
            email: '',
            phone: '',
        });
        setEditId('');
    };

    const handleSave = async () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // if (!formData.companyCode) {
        //     errors.companyCode = 'client Code is required';
        // }

        if (!formData.employeeCode) {
            errors.employeeCode = 'Code is required';
        }
        if (!formData.employeeName) {
            errors.employeeName = 'Name is required';
        }
        if (!formData.email) {
            errors.email = 'Email is required';
        }
        // if (!formData.clientType) {
        //   errors.clientType = 'client Type is required';
        // }
        if (!formData.phone) {
            errors.phone = 'Phone Number is required';
        }

        if (Object.keys(errors).length === 0) {
            setIsLoading(true);

            const saveData = {
                ...(editId && { id: editId }),
                active: formData.active,
                // companyCode: formData.companyCode,
                employeeCode: formData.employeeCode,
                employeeName: formData.employeeName,
                email: formData.email,
                phone: formData.phone,
                webSite: formData.webSite,
                orgId: orgId
            };
            console.log('DATA TO SAVE IS:', saveData);
            // create method
            try {
                const response = await apiCalls('put', `companycontroller/updateCreateCompanyEmployee`, saveData);
                if (response.status === true) {
                    console.log('Response:', response);
                    showToast('success', editId ? ' CompanyEmployee Updated Successfully' : 'CompanyEmployee created successfully');

                    handleClear();
                    getCompanyEmployeeById();
                    // getAllCompanyCode();
                    setIsLoading(false);
                } else {
                    showToast('error', response.paramObjectsMap.errorMessage || 'CompanyEmployee creation failed');
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('error', 'CompanyEmployee creation failed');

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
            <div className="card w-full p-6 bg-base-100" style={{ padding: '20px', borderRadius: '10px' }}>
                <div className="row d-flex ml">
                    <div className="col-lg-12 col-sm-12 col-md-12 col-12 d-flex justify-content-start align-items-center ml-auto" style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                        <div className="d-flex flex-wrap justify-content-start" style={{ marginBottom: '20px' }}>

                            {/* Search Button */}
                            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
                            {/* <button class="custom-btn btn-1" onClick={() => console.log('Search Clicked')}><span>Click!</span><span>Search</span></button> */}
                            {/* <button className="custom-btn btn-1" onClick={() => console.log('Search Clicked')}>
                            <span>Search</span>
                            <span><SearchIcon style={{ marginRight: '8px' }} /></span>
                            </button> */}

                            {/* Clear Button */}
                            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
                            {/* <button class="custom-btn btn-1 ms-2" onClick={handleClear}><span>Click!</span><span>Clear</span></button> */}
                            {/* <button className="custom-btn btn-1 ms-2" onClick={handleClear}>
                            <span>Clear</span>
                            <span><ClearIcon style={{ marginRight: '8px' }} /></span>
                            </button> */}

                            {/* List View Button */}
                            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
                            {/* <button class="custom-btn btn-1 ms-2" onClick={handleView}><span>Click!</span><span>List</span></button> */}
                            {/* <button className="custom-btn btn-1 ms-2" onClick={handleView}>
                            <span>List</span>
                             span><FormatListBulletedTwoToneIcon style={{ marginRight: '8px' }} /></span>
                            </button> */}

                            {/* Save Button */}
                            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} margin="0 10px 0 10px" />
                            {/* <button class="custom-btn btn-1 ms-lg-2 ms-0 mt-lg-0 mt-3" onClick={handleSave}><span>Click!</span><span>Save</span></button> */}
                            {/* <button className="custom-btn btn-1 ms-2" onClick={handleSave}>
                            <span>Save</span>
                            <span><SaveIcon style={{ marginRight: '8px' }} /></span>
                            </button> */}
                        </div>
                    </div>
                </div>

                {/* Form fields */}
                {listView ? (
                    <div className="mt-4">
                        <CommonListViewTable
                            data={listViewData}
                            columns={listViewColumns}
                            blockEdit={true}
                            toEdit={getEmployeById}
                        />
                    </div>
                ) : (
                    <>
                        <div className="row">
                            {/* company code  */}
                            {/* <div className="col-md-3 mb-3">
                                <FormControl fullWidth size="small" variant="outlined" error={!!fieldErrors.clientType}>
                                    <InputLabel>Company Code </InputLabel>
                                    <Select
                                        label="company Code"
                                        name="companyCode"
                                        value={formData.companyCode}
                                        onChange={handleInputChange}
                                        labelId="client-type-label"
                                    >
                                        {allCompanyCode.map((option) => (
                                            <MenuItem key={option.id} value={option.companyCode}>
                                                {option.companyCode}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {fieldErrors.companyCode && <p className="error">{fieldErrors.companyCode}</p>}
                                </FormControl>
                            </div> */}

                            {/* employe Code */}
                            <div className="col-md-3 mb-3">
                                <TextField
                                    label="Code"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    name="employeeCode"
                                    value={formData.employeeCode}
                                    onChange={handleInputChange}
                                    error={!!fieldErrors.employeeCode}
                                    helperText={fieldErrors.employeeCode}
                                />
                            </div>

                            {/* employe Name */}
                            <div className="col-md-3 mb-3">
                                <TextField
                                    label="Name"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    name="employeeName"
                                    value={formData.employeeName}
                                    onChange={handleInputChange}
                                    error={!!fieldErrors.employeeName}
                                    helperText={fieldErrors.employeeName}
                                />
                            </div>

                            {/* employe Mail */}
                            <div className="col-md-3 mb-3">
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    error={!!fieldErrors.email}
                                    helperText={fieldErrors.email}
                                />
                            </div>

                            {/* phone number */}
                            <div className="col-md-3 mb-3">
                                <TextField
                                    label="Phone"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    error={!!fieldErrors.phone}
                                    helperText={fieldErrors.phone}
                                />
                            </div>

                            {/* Active Checkbox */}
                            <div className="col-md-3 mb-3">
                                <FormControlLabel
                                    control={<Checkbox checked={formData.active} onChange={handleInputChange} name="active" />}
                                    label="Active"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
            <ToastContainer />
        </>
    );
};

export default CreateClientEmploye;
