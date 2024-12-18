import { Cancel, Delete, Edit, Save } from '@mui/icons-material';
import UploadIcon from '@mui/icons-material/Upload';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';
import ActionButton from 'utils/ActionButton';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import MIR from '../../assets/sample-files/MIR.xlsx';

const ElTBReport = () => {
  const [data, setData] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [newRow, setNewRow] = useState({ description: '', elCode: '' });

  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    if (id) {
      setData((prev) => prev.map((row) => (row.id === id ? { ...row, [name]: value } : row)));
    } else {
      setNewRow((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    getAllMFR();
  }, []);

  const getAllMFR = async () => {
    try {
      const result = await apiCalls('get', `eLReportController/getAllElMfr?orgId=${1}`);
      setData(result.paramObjectsMap.elMfrVO);
      console.log('Test', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  // const handleAddRow = () => {
  //   if (newRow.description && newRow.elCode) {
  //     setData((prev) => [...prev, { ...newRow, id: Date.now() }]);
  //     setNewRow({ description: '', elCode: '' });
  //   }
  // };

  const handleAddRow = async () => {
    if (newRow.description && newRow.elCode) {
      const payload = {
        createdBy: 'admin',
        description: newRow.description,
        elCode: newRow.elCode,
        orgId: 1
      };

      try {
        // Call the POST API to save data
        const response = await apiCalls('put', 'eLReportController/createUpdateElMfr', payload);

        // Assuming the response has the updated row with an ID
        getAllMFR();
        setNewRow({ description: '', elCode: '' }); // Reset the new row form
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  };

  const handleEditRow = (id) => setIsEditing(id);

  const handleSaveRow = async (id) => {
    const rowToUpdate = data.find((row) => row.id === id);

    const payload = {
      id: rowToUpdate.id, // existing ID
      createdBy: 'admin', // example hardcoded createdBy
      description: rowToUpdate.description,
      elCode: rowToUpdate.elCode,
      orgId: 1 // organization ID
    };

    try {
      // Call the PUT API
      await apiCalls('put', 'eLReportController/createUpdateElMfr', payload);

      // Refresh the data
      await getAllMFR();

      // Exit edit mode
      setIsEditing(null);
    } catch (error) {
      console.error('Error updating row:', error);
    }
  };

  const handleCancelEdit = () => setIsEditing(null);
  const handleDeleteRow = (id) => setData((prev) => prev.filter((row) => row.id !== id));

  //upload
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
    // toast.success('File uploaded successfully');
    console.log('Submit clicked');
    handleBulkUploadClose();
    getAllMFR();
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          borderRadius: '16px',
          boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2 // Adds bottom margin
          }}
        >
          {/* Left-aligned title */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: '#333333',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            EL TB Report
          </Typography>

          {uploadOpen && (
            <CommonBulkUpload
              open={uploadOpen}
              handleClose={handleBulkUploadClose}
              title="Upload Files"
              uploadText="Upload file"
              downloadText="Sample File"
              fileName="sampleFile.xlsx"
              onSubmit={handleSubmit}
              sampleFileDownload={MIR}
              handleFileUpload={handleFileUpload}
              apiUrl={`/eLReportController/excelUploadForElMfr`}
              screen="MIR"
              orgId={1}
              // loginUser={loginUserName}
              // clientCode={clientCode}
            />
          )}

          {/* Right-aligned button */}
          <ActionButton icon={UploadIcon} title="Upload" onClick={handleBulkUploadOpen} />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#ffffff', padding: '8px 16px' }}>SL NO.</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#ffffff', padding: '8px 16px' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#ffffff', padding: '8px 16px' }}>EL NO.</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#ffffff', padding: '8px 16px' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={row.id}
                  sx={{
                    '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                    '&:hover': { backgroundColor: '#e3f2fd' },
                    transition: 'background-color 0.3s ease'
                  }}
                >
                  <TableCell sx={{ padding: '4px 8px' }}>{index + 1}</TableCell>
                  <TableCell sx={{ padding: '4px 8px' }}>
                    {isEditing === row.id ? (
                      <TextField
                        variant="outlined"
                        size="small"
                        name="description"
                        value={row.description}
                        onChange={(e) => handleInputChange(e, row.id)}
                        sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                      />
                    ) : (
                      row.description
                    )}
                  </TableCell>
                  <TableCell sx={{ padding: '4px 8px' }}>
                    {isEditing === row.id ? (
                      <TextField
                        variant="outlined"
                        size="small"
                        name="elCode"
                        value={row.elCode}
                        onChange={(e) => handleInputChange(e, row.id)}
                        sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                      />
                    ) : (
                      row.elCode
                    )}
                  </TableCell>
                  <TableCell sx={{ padding: '4px 8px' }}>
                    {isEditing === row.id ? (
                      <>
                        <Tooltip title="Save">
                          <IconButton color="success" onClick={() => handleSaveRow(row.id)}>
                            <Save />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <IconButton color="error" onClick={handleCancelEdit}>
                            <Cancel />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditRow(row.id)}
                            sx={{ backgroundColor: '#e3f2fd', borderRadius: '8px' }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteRow(row.id)}
                            sx={{ backgroundColor: '#ffebee', borderRadius: '8px', marginLeft: '5px' }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {/* Add New Row */}
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>New</TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    name="description"
                    value={newRow.description}
                    placeholder="Enter description"
                    onChange={(e) => handleInputChange(e)}
                    sx={{ backgroundColor: '#ffffff', borderRadius: '8px' }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    name="elCode"
                    value={newRow.elCode}
                    placeholder="Enter EL NO."
                    onChange={(e) => handleInputChange(e)}
                    sx={{ backgroundColor: '#ffffff', borderRadius: '8px' }}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Add">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddRow}
                      sx={{
                        borderRadius: '8px',
                        boxShadow: '0px 3px 5px rgba(0,0,0,0.2)',
                        textTransform: 'none'
                      }}
                    >
                      Add Row
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default ElTBReport;
