import { AccountBalance, AccountBalanceWallet, ChevronRight, Circle as CircleIcon, ExpandMore } from '@mui/icons-material';
import {
  Box,
  CircularProgress,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import apiCalls from 'apicall';

import { useEffect, useState } from 'react';

const ClientTBReport = () => {
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [isCollapsed, setIsCollapsed] = useState(true); // State for collapse/expand

  useEffect(() => {
    getMapData();
  }, []);

  const getMapData = async () => {
    try {
      const result = await apiCalls('get', `/businesscontroller/getCOAMap`);
      if (result?.paramObjectsMap?.COA) {
        const transformedData = transformCOAData(result.paramObjectsMap.COA);
        setTreeData(transformedData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const transformCOAData = (coaData) => {
    const transformNode = (node) => ({
      id: node.mainGroupCode || node.subGroupCode || node.accountCode,
      name: node.mainGroupName || node.subGroupName || node.accountName,
      code: node.mainGroupCode || node.subGroupCode || node.accountCode,
      icon: node.mainGroupName ? (
        <AccountBalance />
      ) : node.subGroupName ? (
        <AccountBalanceWallet />
      ) : (
        <CircleIcon sx={{ fontSize: '11px' }} />
      ),
      children: node.subGroups ? node.subGroups.map(transformNode) : node.accounts ? node.accounts.map(transformNode) : null
    });

    return coaData.map(transformNode);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev); // Toggle collapse state
  };

  return (
    <Box
      sx={{
        padding: 3,
        maxWidth: 500,
        backgroundColor: '#ffffff',
        borderRadius: 2,
        borderColor: '#90caf975'
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={2}>
        COA Ledgers
      </Typography>

      {/* Header with Search Bar and Toggle Switch */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, mr: 2 }}
        />
        <Box display="flex" alignItems="center">
          <Typography variant="body2" mr={1}>
            {isCollapsed ? 'Expand All' : 'Collapse All'}
          </Typography>
          <Switch
            checked={isCollapsed}
            onChange={handleToggleCollapse}
            inputProps={{ 'aria-label': 'Toggle Collapse/Expand' }}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#4caf50'
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#4caf50'
              },
              '& .MuiSwitch-track': {
                backgroundColor: '#d32f2f'
              }
            }}
          />
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : (
        <TreeView data={treeData} searchTerm={searchTerm} isCollapsed={isCollapsed} />
      )}
    </Box>
  );
};

const TreeView = ({ data, searchTerm, isCollapsed }) => {
  if (!data.length) {
    return <Typography color="textSecondary">No data available</Typography>;
  }

  return (
    <List>
      {data.map((node) => (
        <TreeItem key={node.id} node={node} searchTerm={searchTerm} isCollapsed={isCollapsed} />
      ))}
    </List>
  );
};

const TreeItem = ({ node, level = 0, searchTerm, isCollapsed }) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(!isCollapsed); // Collapse or expand based on `isCollapsed`
  }, [isCollapsed]);

  const toggleExpand = () => setExpanded(!expanded);

  return (
    <>
      <ListItem
        button
        onClick={toggleExpand}
        sx={{
          pl: level * 3,
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '50%',
            width: '1px',
            height: '100%',
            backgroundColor: '#ccc',
            zIndex: -1
          }
        }}
      >
        <ListItemIcon>{node.icon}</ListItemIcon>
        <ListItemText
          primary={
            <Box display="flex" alignItems="center">
              <b>{node.code}</b>&nbsp; - &nbsp; {node.name}
            </Box>
          }
        />
        {node.children && (
          <IconButton size="small" edge="end">
            {expanded ? <ExpandMore /> : <ChevronRight />}
          </IconButton>
        )}
      </ListItem>
      {node.children && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {node.children.map((child) => (
              <TreeItem key={child.id} node={child} level={level + 1} searchTerm={searchTerm} isCollapsed={isCollapsed} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default ClientTBReport;
