import apiCalls from 'apicall';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MismatchTable from './TableMismatch';

const MismatchDB = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [clientCode, setClientCode] = useState(localStorage.getItem('clientCode'));
  const [listView, setListView] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    getMismatch();
  }, []);

  const getMismatch = async () => {
    try {
      const result = await apiCalls('get', `/eLReportController/getMisMatchClientTb?orgId=${orgId}&clientCode=${clientCode}`);
      if (result) {
        setData(result.paramObjectsMap.coaVO);
        setListView(true);
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const listViewColumns = [
    {
      accessorKey: 'accountCode',
      header: 'Account Code',
      size: 80,
      Cell: ({ row }) => {
        const { screen, accountCode, accountName } = row.original;

        // Determine navigation based on the `id` value
        const navigateTo =
          screen === 1
            ? `/ledgers/ClientCOA?accountCode=${accountCode}&accountName=${accountName}`
            : screen === 2
              ? `/ledgers/ledgersMapping?accountCode=${accountCode}`
              : null;

        // Render clickable link if navigation is defined
        return navigateTo ? (
          <Link
            to={navigateTo}
            style={{
              color: 'blue',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            {accountCode}
          </Link>
        ) : (
          accountCode // Fallback to plain text if no navigation is defined
        );
      }
    },
    { accessorKey: 'accountName', header: 'Account Name', size: 100 },
    { accessorKey: 'action', header: 'Action', size: 180 }
    // { accessorKey: 'id', header: 'Id', size: 140 }
  ];

  return (
    <>
      <div className="card w-full p-3 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        {listView && (
          <div className="mt-1">
            <MismatchTable
              data={data}
              columns={listViewColumns}
              blockEdit={true}
              // toEdit={getCompanyById}
            />
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default MismatchDB;
