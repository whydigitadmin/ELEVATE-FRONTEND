import React, { useState } from 'react';
import { ClearIcon } from '@mui/x-date-pickers';
import { ToastContainer } from 'react-toastify';
// import CommonListViewTable from '../basicMaster/CommonListViewTable';
import ToastComponent, { showToast } from 'utils/toast-component';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload';
import ActionButton from 'utils/ActionButton';
import ElevateCommonViewTable from '../basicMaster/ElevateCommonViewTable';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import { toast } from 'react-toastify'

const ClientLedgers = () => {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [listViewData, setListViewData] = useState([
    { clientLedgers: 'Ledger 1', active: true },
    { clientLedgers: 'Ledger 2', active: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    clientLedgers: '',
    active: ''
  });
  const [formData, setFormData] = useState({
    clientLedgers: '',
    active: true
  });

  const listViewColumns = [
    { accessorKey: 'clientLedgers', header: 'Client Ledgers', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 100 }
  ];


  const handleBulkUploadOpen = () => {
    setUploadOpen(true);
};

const handleBulkUploadClose = () => {
    setUploadOpen(false);
};

const handleFileUpload = (event) => {
  console.log(event.target.files[0]);
};

const handleSubmit = () => {
  toast.success("File uploded sucessfully")
  console.log('Submit clicked');
  handleBulkUploadClose();
  // getAllData();
};

  const handleClear = () => {
    setFormData({
      clientLedgers: '',
      active: true
    });
    setFieldErrors({
      clientLedgers: '',
      active: '',
    });
    setEditId('');
  };

  const handleDataSubmit = async () => {
    const errors = {};

    if (!formData.clientLedgers.trim()) {
      errors.clientLedgers = 'Elevate Ledgers is required';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length === 0) {
      const updatedData = editId
        ? listViewData.map(item =>
          item.clientLedgers === editId ? { ...formData } : item
        )
        : [...listViewData, formData];

      setListViewData(updatedData);
      showToast('success', 'Data saved successfully!');
      handleClear();
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <form style={{ width: '100%' }}>
          <div className="flex justify-between mb-4">
            <ActionButton icon={SearchIcon} title='Search' />
            <ActionButton icon={ClearIcon} title='Clear' onClick={handleClear} />
            <ActionButton icon={SaveIcon} title='Save' onClick={handleDataSubmit} disabled={isLoading} />
            <ActionButton icon={UploadIcon} title='Upload' onClick={handleBulkUploadOpen} />

            {uploadOpen && (
              <CommonBulkUpload
                open={uploadOpen}
                handleClose={handleBulkUploadClose}
                title="Upload Files"
                uploadText="Upload file"
                downloadText="Sample File"
                onSubmit={handleSubmit}
                // sampleFileDownload={FirstData}
                handleFileUpload={handleFileUpload}
                // apiUrl={`excelfileupload/excelUploadForSample`}
                screen="PutAway"
              />
            )}
          </div>
          <div className="mt-4">
            <ElevateCommonViewTable
              data={listViewData}
              columns={listViewColumns}
              blockEdit={true}
            />
          </div>
        </form>
      </div>
      <ToastComponent />
    </>
  );
};

export default ClientLedgers;

