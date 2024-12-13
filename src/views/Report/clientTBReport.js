import { AccountBalance, AccountBalanceWallet, AttachMoney, ChevronRight, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Chip,
  CircularProgress,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography
} from '@mui/material';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';

const TreeItem = ({ node, level = 0, searchTerm, colorCombination = 1 }) => {
  const [expanded, setExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // State to manage visibility

  const toggleExpand = () => setExpanded(!expanded);

  const getBadgeColor = (level) => {
    switch (level) {
      case 0:
        return '#3a86ff'; // Blue for Main Group
      case 1:
        return '#6a994e'; // Green for Sub Group
      default:
        return '#a7c957'; // Gray for Account
    }
  };

  const getBadgeColorIcon = (level) => {
    switch (level) {
      case 0:
        return '#000000'; // Blue for Main Group
      case 1:
        return '#000000'; // Green for Sub Group
      default:
        return '#000000'; // Gray for Account
    }
  };

  useEffect(() => {
    if (searchTerm) {
      // Check if the node's name or code matches the search term
      const searchMatch =
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) || node.code.toLowerCase().includes(searchTerm.toLowerCase());

      setIsVisible(searchMatch); // Show the node if it matches the search term
    } else {
      setIsVisible(true); // Show all nodes if the search term is empty
    }
  }, [searchTerm, node.name, node.code]);

  if (!isVisible) return null; // Return nothing if node doesn't match the search term

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
            backgroundColor: '#ccc', // Line color
            zIndex: -1
          }
        }}
      >
        <ListItemIcon sx={{ color: getBadgeColorIcon(level, colorCombination) }}>{node.icon}</ListItemIcon>

        <ListItemText
          primary={
            <Box display="flex" alignItems="center">
              {node.name}
              {node.code && (
                <Chip
                  label={node.code}
                  size="small"
                  sx={{
                    ml: 1,
                    paddingTop: 0.5,
                    backgroundColor: getBadgeColor(level), // Set color based on node level
                    color: '#ffffff',
                    borderColor: getBadgeColor(level),
                    borderWidth: 1
                  }}
                />
              )}
            </Box>
          }
        />
        {node.children ? (
          <IconButton size="small" edge="end">
            {expanded ? <ExpandMore /> : <ChevronRight />}
          </IconButton>
        ) : null}
      </ListItem>
      {node.children && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {node.children.map((child) => (
              <TreeItem key={child.id} node={child} level={level + 1} searchTerm={searchTerm} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

const TreeView = ({ data, searchTerm }) => {
  if (!data.length) {
    return <Typography color="textSecondary">No data available</Typography>;
  }

  return (
    <List>
      {data.map((node) => (
        <TreeItem key={node.id} node={node} searchTerm={searchTerm} />
      ))}
    </List>
  );
};

function ClientTBReport() {
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

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
      code: node.mainGroupCode || node.subGroupCode || node.accountCode, // Separate field for group code
      icon: node.mainGroupName ? <AccountBalance /> : node.subGroupName ? <AccountBalanceWallet /> : <AttachMoney />,
      children: node.subGroups ? node.subGroups.map(transformNode) : node.accounts ? node.accounts.map(transformNode) : null
    });

    return coaData.map(transformNode);
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 500, backgroundColor: '#ffffff', borderRadius: 2, borderColor: '#90caf975' }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        COA Ledgers
      </Typography>

      {/* Search Bar */}
      <TextField
        variant="outlined"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : (
        <TreeView data={treeData} searchTerm={searchTerm} />
      )}
    </Box>
  );
}

export default ClientTBReport;
