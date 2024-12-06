import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import ToastComponent, { showToast } from 'utils/toast-component';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ActionButton from 'utils/ActionButton';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/system';
import { ClearIcon } from '@mui/x-date-pickers';
import UploadIcon from '@mui/icons-material/Upload';
import { Checkbox } from '@mui/material';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import { toast } from 'react-toastify';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ElevateLedgers = () => {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listViewData, setListViewData] = useState([
    { id: 1, elevateLedgers: 'Ledger 1', active: true },
    { id: 2, elevateLedgers: 'Ledger 2', active: false },
    { id: 3, elevateLedgers: 'Ledger 3', active: true },
    { id: 4, elevateLedgers: 'Ledger 4', active: false },
    { id: 5, elevateLedgers: 'Ledger 5', active: true },
    { id: 6, elevateLedgers: 'Ledger 6', active: true },
    { id: 7, elevateLedgers: 'Ledger 7', active: false },
    { id: 8, elevateLedgers: 'Ledger 8', active: true },
    { id: 9, elevateLedgers: 'Ledger 9', active: true },
    { id: 10, elevateLedgers: 'Ledger 10', active: false },
    { id: 11, elevateLedgers: 'Ledger 11', active: true },
    { id: 12, elevateLedgers: 'Ledger 12', active: false },
    { id: 13, elevateLedgers: 'Ledger 13', active: true },
    { id: 14, elevateLedgers: 'Ledger 14', active: true },
    { id: 15, elevateLedgers: 'Ledger 15', active: false },
  ]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    elevateLedgers: '',
    active: true,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Number of rows per page, set to 5 now

  // Get rows for the current page
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return listViewData.slice(startIndex, endIndex);
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

  const handleSubmit = () => {
    toast.success("File uploaded successfully");
    console.log('Submit clicked');
    handleBulkUploadClose();
    // getAllData();
  };

  const handleDataSubmit = async () => {
    const errors = {};

    if (!formData.elevateLedgers.trim()) {
      errors.elevateLedgers = 'Client Ledgers is required';
    }

    if (Object.keys(errors).length === 0) {
      const updatedData = editId
        ? listViewData.map(item =>
          item.id === editId ? { ...formData } : item
        )
        : [...listViewData, formData];

      setListViewData(updatedData);
      showToast('success', 'Data saved successfully!');
      handleClear();
    }
  };

  const handleEditClick = (row) => {
    setEditId(row.id);
    setFormData({ elevateLedgers: row.elevateLedgers, active: row.active });
  };

  const handleSaveEdit = () => {
    const updatedData = listViewData.map((item) =>
      item.id === editId ? { ...item, ...formData } : item
    );
    setListViewData(updatedData);
    showToast('success', 'Data updated successfully!');
    setEditId(null);
    setFormData({ elevateLedgers: '', active: true });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, active: e.target.checked });
  };

  const handleClear = () => {
    setFormData({ elevateLedgers: '', active: true });
    setEditId(null);
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  // Get total rows and the range of rows displayed
  const totalRows = listViewData.length;
  const startRow = (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, totalRows);

  return (
    <>
      <ToastContainer />
      <ActionButton icon={SearchIcon} title='Search' />
      <ActionButton icon={ClearIcon} title='Clear' onClick={handleClear} />
      <ActionButton icon={UploadIcon} title='Upload' onClick={handleBulkUploadOpen} />

      {uploadOpen && (
        <CommonBulkUpload
          open={uploadOpen}
          handleClose={handleBulkUploadClose}
          title="Upload Files"
          uploadText="Upload file"
          downloadText="Sample File"
          onSubmit={handleSubmit}
          handleFileUpload={handleFileUpload}
          screen="PutAway"
        />
      )}

      <div className="row mt-2">
        <Box sx={{ padding: 2 }}>
          <div className="row d-flex ml">
            <div className="row mt-2">
              <div className="col-lg-12">
                <div className="table-responsive border">
                  <table className="table table-bordered">
                    <thead>
                      <tr style={{ backgroundColor: '#673AB7' }}>
                        <th className="px-2 py-3 text-white text-center" style={{ width: '100px' }}>
                          Action
                        </th>
                        <th className="px-2 py-3 text-white text-center" style={{ width: '100px' }}>
                          S.No
                        </th>
                        <th className="px-2 py-3 text-white text-center">Elevate Ledgers</th>
                        <th className="px-2 py-3 text-white text-center" style={{ width: '300px' }}>Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getCurrentPageData().map((row, index) => (
                        <tr key={row.id}>
                          <td className="border px-2 py-2 text-center">
                            {editId === row.id ? (
                              <ActionButton title="Save" icon={SaveIcon} onClick={handleSaveEdit} />
                            ) : (
                              <ActionButton title="Edit" icon={EditIcon} onClick={() => handleEditClick(row)} />
                            )}
                          </td>
                          <td className="border px-2 py-2 text-center">{startRow + index}</td>
                          <td className="border px-2 py-2">
                            {editId === row.id ? (
                              <input
                                type="text"
                                name="elevateLedgers"
                                value={formData.elevateLedgers}
                                onChange={handleInputChange}
                                className="form-control"
                              />
                            ) : (
                              row.elevateLedgers
                            )}
                          </td>
                          <td className="border px-2 py-2" style={{ textAlign: 'center' }}>
                            {editId === row.id ? (
                              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Checkbox
                                  checked={formData.active}
                                  onChange={handleCheckboxChange}
                                  sx={{
                                    color: formData.active ? 'green' : 'red', // Checkbox color green when active, red when inactive
                                    '&.Mui-checked': {
                                      color: 'green', // Checkbox color green when checked
                                    },
                                  }}
                                />
                                <span style={{ marginLeft: '8px', color: formData.active ? 'green' : 'red' }}>
                                  {formData.active ? 'Active' : 'InActive'}
                                </span>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Checkbox
                                  checked={row.active}
                                  disabled
                                  sx={{
                                    color: row.active ? 'green' : 'red', // Checkbox color green when active, red when inactive
                                    '&.Mui-checked': {
                                      color: 'green', // Checkbox color green when checked
                                    },
                                  }}
                                />
                                <span style={{ marginLeft: '8px', color: row.active ? 'green' : 'red' }}>
                                  {row.active ? 'Active' : 'InActive'}
                                </span>
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
        </Box>
      </div>

      {/* Pagination Information */}
      <div className='d-flex align-items-end justify-content-end'>
        <div className='pe-4'>
          Rows per page
        </div>
        <div className="pagination-info pe-4">
          <span>{`${startRow}-${endRow} of ${totalRows}`}</span>
        </div>
        {/* Pagination Controls with Icons */}
        <div className="pagination-controls">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            style={{ backgroundColor: 'transparent', border: 'none' }}>
            <ArrowBackIosIcon sx={{ fontSize: 18 }} /> {/* Adjust size here */}
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage * pageSize >= totalRows}
            style={{ backgroundColor: 'transparent', border: 'none' }}>
            <ArrowForwardIosIcon sx={{ fontSize: 18 }} /> {/* Adjust size here */}
          </button>
        </div>
      </div>





      <ToastComponent />
    </>
  );
};

export default ElevateLedgers;
