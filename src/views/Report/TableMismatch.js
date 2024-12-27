import { Chip, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MaterialReactTable } from 'material-react-table';
import { useEffect, useState } from 'react';

const MismatchTable = ({ data, columns, blockEdit, toEdit, disableEditIcon, viewIcon, isPdf, GeneratePdf }) => {
  const [tableData, setTableData] = useState(data || []);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));

  const theme = useTheme();

  const chipSX = {
    height: 24,
    padding: '0 6px'
  };

  const chipSuccessSX = {
    ...chipSX,
    color: theme.palette.success.dark,
    backgroundColor: theme.palette.success.light,
    height: 28
  };

  const chipErrorSX = {
    ...chipSX,
    color: theme.palette.orange.dark,
    backgroundColor: theme.palette.orange.light,
    marginRight: '5px'
  };

  const handleButtonClick = (row) => {
    toEdit(row);
  };

  useEffect(() => {
    console.log('BlockEdit', blockEdit);
  }, []);

  // Add S.No. column
  const snoColumn = {
    accessorKey: 'sno',
    header: 'S.No',
    size: 50,
    Cell: ({ row }) => row.index + 1 // Dynamically generate the serial number
  };

  // Add custom columns including S.No.
  const customColumns = [
    snoColumn,
    ...columns.map((column) => {
      if (column.accessorKey === 'active') {
        return {
          ...column,
          Cell: ({ cell }) => (
            <Chip
              label={cell.getValue() === 'Active' ? 'Active' : 'Inactive'}
              sx={cell.getValue() === 'Active' ? chipSuccessSX : chipErrorSX}
            />
          )
        };
      }

      if (column.accessorKey === 'closed') {
        return {
          ...column,
          Cell: ({ cell }) => (
            <Chip label={cell.getValue() === 'Yes' ? 'Yes' : 'No'} sx={cell.getValue() === 'Yes' ? chipSuccessSX : chipErrorSX} />
          )
        };
      }

      return column;
    })
  ];

  return (
    <>
      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center'
            },
            size: 120
          }
        }}
        columns={customColumns}
        data={tableData && tableData}
        enableColumnOrdering
        renderTopToolbarCustomActions={() => <Stack direction="row" spacing={2} className="ml-5 "></Stack>}
      />
    </>
  );
};

export default MismatchTable;
