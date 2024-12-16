import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import apiCalls from 'apicall';
import { useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';
import UploadIcon from '@mui/icons-material/Upload';
import CommonBulkUpload from 'utils/CommonBulkUpload';

const ElDemoReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [editId, setEditId] = useState('');
  const [formData, setFormData] = useState([{
    id: 1,
    group: '',
    budget: '',
    actuals: '',
    lastYear: '',
    ytd: '',
    eltReport: ''
  }]);
  const [fieldErrors, setFieldErrors] = useState({
    group: '',
    budget: '',
    actuals: '',
    lastYear: '',
    ytd: '',
    eltReport: ''
  });
  const [uploadOpen, setUploadOpen] = useState(false);
  const [listView, setListView] = useState(false);

  const listViewColumns = [
    { accessorKey: 'description', header: 'Description', size: 140 },
    { accessorKey: 'budget', header: 'Budget', size: 140 },
    {
      accessorKey: 'actuals',
      header: 'Actuals',
      size: 140
    },
    {
      accessorKey: 'lastYear',
      header: 'Last Year',
      size: 140
    },
    {
      accessorKey: 'ytd',
      header: 'YTD',
      size: 140
    },
    {
      accessorKey: 'eltReport',
      header: 'ELT Report',
      size: 140
    }
  ];
  const [listViewData, setListViewData] = useState([]);

  const handleClear = () => {
    setFormData([
      {
        id: 1,
        group: '',
        budget: '',
        actuals: '',
        lastYear: '',
        ytd: '',
        eltReport: ''
      }
    ]);
    setEditId('');
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

    if (!formData.budget) {
      errors.budget = 'Budget is required';
    }
    if (!formData.actuals) {
      errors.actuals = 'Actuals is required';
    }
    if (!formData.lastYear) {
      errors.lastYear = 'Last year is required';
    }
    if (!formData.ytd) {
      errors.ytd = 'YTD is required';
    }
    if (!formData.eltReport) {
      errors.eltReport = 'EltReport is required';
    }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

      const saveData = {
        ...(editId && { id: editId }),
        active: formData.active,
        budget: formData.budget,
        actuals: formData.actuals,
        createdBy: loginUserName,
        lastYear: formData.lastYear,
        ytd: formData.ytd,
        eltReport: formData.eltReport,
        orgId: orgId
      };

      console.log('DATA TO SAVE IS:', saveData);

      try {
        const response = await apiCalls('put', `/companycontroller/updateCreateCompany`, saveData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? ' ELT Report Updated Successfully' : 'ELT Report created successfully');
          // handleClear();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.message || 'ELT Report creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'ELT Report creation failed');
        setIsLoading(false);
      }
    } else {
      // setFieldErrors(errors);
    }
  };

  const handleInputChange = (index, field, value) => {
    setFormData((prev) =>
      Array.isArray(prev)
        ? prev.map((row, i) =>
          i === index ? { ...row, [field]: value } : row
        )
        : []
    );
  };

  const handleView = () => {
    setListView(!listView);
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton icon={UploadIcon} title='Upload' onClick={handleBulkUploadOpen} />
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} />

            {uploadOpen && (
              <CommonBulkUpload
                open={uploadOpen}
                handleClose={handleBulkUploadClose}
                dialogTitle="Upload Files"
                uploadText="Upload File"
                downloadText="Sample File"
                fileName="sampleFile.xlsx"
                onSubmit={handleSubmit}
                // sampleFileDownload={SampleFile}
                handleFileUpload={handleFileUpload}
                apiUrl="businesscontroller/excelUploadForCoa"
                screen="PutAway"
              />
            )}

          </div>
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable
              data={listViewData}
              columns={listViewColumns}
              blockEdit={true}
            // toEdit={getCompanyById}
            />
          </div>
        ) : (
          <>
            <div className="row mt-2">
              <div className="col-lg-12">
                <div className="table-responsive">
                  <table className="table table-bordered ">
                    <thead>
                      <tr style={{ backgroundColor: '#673AB7' }}>
                        {/* <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                          Action
                        </th> */}
                        <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                          S.No
                        </th>
                        <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                          Description
                        </th>
                        <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                          Budget
                        </th>
                        <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                          Actuals
                        </th>
                        <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                          Last Year
                        </th>
                        <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                          YTD
                        </th>
                        <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                          ELT Report
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.map((row, index) => (
                        <tr key={row.id}>
                          <td className="text-center">
                            <div className="pt-2">{index + 1}</div>
                          </td>
                          <td className="text-center">
                            <div className="pt-2"></div>
                          </td>
                          <td className="border px-2 py-2">
                            <input
                              type="text"
                              value={row.budget}
                              onChange={(e) => handleInputChange(index, 'budget', e.target.value)}
                              className={fieldErrors[index]?.budget ? 'error form-control' : 'form-control'}
                            />
                            {fieldErrors[index]?.budget && (
                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                {fieldErrors[index].budget}
                              </div>
                            )}
                          </td>
                          <td className="border px-2 py-2">
                            <input
                              type="text"
                              value={row.actuals}
                              onChange={(e) => handleInputChange(index, 'actuals', e.target.value)}
                              className={fieldErrors[index]?.actuals ? 'error form-control' : 'form-control'}
                            />
                            {fieldErrors[index]?.actuals && (
                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                {fieldErrors[index].actuals}
                              </div>
                            )}
                          </td>
                          <td className="border px-2 py-2">
                            <input
                              type="text"
                              value={row.lastYear}
                              onChange={(e) => handleInputChange(index, 'lastYear', e.target.value)}
                              className={fieldErrors[index]?.lastYear ? 'error form-control' : 'form-control'}
                            />
                            {fieldErrors[index]?.lastYear && (
                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                {fieldErrors[index].lastYear}
                              </div>
                            )}
                          </td>
                          <td className="border px-2 py-2">
                            <input
                              type="text"
                              value={row.ytd}
                              onChange={(e) => handleInputChange(index, 'ytd', e.target.value)}
                              className={fieldErrors[index]?.ytd ? 'error form-control' : 'form-control'}
                            />
                            {fieldErrors[index]?.ytd && (
                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                {fieldErrors[index].ytd}
                              </div>
                            )}
                          </td>
                          <td className="border px-2 py-2">
                            <input
                              type="text"
                              value={row.eltReport}
                              onChange={(e) => handleInputChange(index, 'eltReport', e.target.value)}
                              className={fieldErrors[index]?.eltReport ? 'error form-control' : 'form-control'}
                            />
                            {fieldErrors[index]?.eltReport && (
                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                {fieldErrors[index].eltReport}
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
          </>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default ElDemoReport;
