import React, { useState } from 'react';
import { Tabs, Tab, Checkbox, IconButton, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ExpandMore, ExpandLess, Add } from '@mui/icons-material';

const WorkOrderCreator = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedPackages, setExpandedPackages] = useState({});
  const [expandedActivities, setExpandedActivities] = useState({});
  const [selectedItems, setSelectedItems] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [currentPackageIndex, setCurrentPackageIndex] = useState(null);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(null);

  const [packages, setPackages] = useState([
    {
      name: 'Civil 1',
      rate: 567.80,
      total: 2986792,
      activities: [
        {
          name: 'Activity 1',
          rate: 567.80,
          total: 1493396,
          workItems: ['Work Item 1', 'Work Item 2', 'Work Item 3']
        },
        {
          name: 'Activity 2',
          rate: 567.80,
          total: 1493396,
          workItems: ['Work Item 1', 'Work Item 2', 'Work Item 3']
        },
        { name: 'Activity 3', rate: 0, total: 0, workItems: [] },
        { name: 'Activity 4', rate: 0, total: 0, workItems: [] },
      ]
    },
  ]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const togglePackage = (packageIndex) => {
    setExpandedPackages(prev => ({
      ...prev,
      [packageIndex]: !prev[packageIndex]
    }));
  };

  const toggleActivity = (packageIndex, activityIndex) => {
    setExpandedActivities(prev => ({
      ...prev,
      [`${packageIndex}-${activityIndex}`]: !prev[`${packageIndex}-${activityIndex}`]
    }));
  };

  const handleCheckboxChange = (packageIndex, activityIndex, itemIndex) => {
    const key = `${packageIndex}-${activityIndex}-${itemIndex}`;
    setSelectedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectAll = (packageIndex, activityIndex) => {
    const newSelectedItems = { ...selectedItems };
    const activity = packages[packageIndex].activities[activityIndex];
    activity.workItems.forEach((_, itemIndex) => {
      const key = `${packageIndex}-${activityIndex}-${itemIndex}`;
      newSelectedItems[key] = true;
    });
    setSelectedItems(newSelectedItems);
  };

  const addPackage = () => {
    setPackages(prev => [
      ...prev,
      {
        name: `Civil ${prev.length + 1}`,
        rate: 567.80,
        total: 0,
        activities: []
      }
    ]);
  };

  const openAddDialog = (type, packageIndex, activityIndex = null) => {
    setDialogType(type);
    setCurrentPackageIndex(packageIndex);
    setCurrentActivityIndex(activityIndex);
    setNewItemName('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddItem = () => {
    if (newItemName.trim() === '') return;

    setPackages(prevPackages => {
      const newPackages = [...prevPackages];
      if (dialogType === 'activity') {
        newPackages[currentPackageIndex].activities.push({
          name: newItemName,
          rate: newPackages[currentPackageIndex].rate,
          total: 0,
          workItems: []
        });
      } else if (dialogType === 'workItem') {
        newPackages[currentPackageIndex].activities[currentActivityIndex].workItems.push(newItemName);
      }
      return newPackages;
    });

    handleCloseDialog();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Create Workorder</h1>
        <Button variant="contained" color="primary" onClick={() => console.log('Save clicked')}>
          Save
        </Button>
      </div>

      <Tabs value={activeTab} onChange={handleTabChange} className="mb-4">
        <Tab label="Overview" />
        <Tab label="Other" />
      </Tabs>

      {activeTab === 0 ? (
        <div>
          <table className="w-full">
            <thead>
              <tr className="bg-blue-100">
                <th className="p-2 text-left">Packages</th>
                <th className="p-2 text-left">Rate (in sqft)</th>
                <th className="p-2 text-left">Total</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg, packageIndex) => (
                <React.Fragment key={packageIndex}>
                  <tr>
                    <td className="p-2">
                      <div className="flex items-center">
                        <Checkbox />
                        {pkg.name}
                        <IconButton onClick={() => togglePackage(packageIndex)}>
                          {expandedPackages[packageIndex] ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </div>
                    </td>
                    <td className="p-2">{pkg.rate}</td>
                    <td className="p-2">{formatCurrency(pkg.total)}</td>
                    <td className="p-2"></td>
                  </tr>
                  {expandedPackages[packageIndex] && (
                    <tr>
                      <td colSpan="4" className="p-2">
                        <Button
                          variant="outlined"
                          startIcon={<Add />}
                          onClick={() => openAddDialog('activity', packageIndex)}
                          className="mb-2"
                        >
                          Add Activity
                        </Button>
                        <table className="w-full">
                          <tbody>
                            {pkg.activities.map((activity, activityIndex) => (
                              <React.Fragment key={activityIndex}>
                                <tr className="bg-gray-50">
                                  <td className="p-2 pl-8">
                                    <div className="flex items-center">
                                      <Checkbox />
                                      {activity.name}
                                      <IconButton onClick={() => toggleActivity(packageIndex, activityIndex)}>
                                        {expandedActivities[`${packageIndex}-${activityIndex}`] ? <ExpandLess /> : <ExpandMore />}
                                      </IconButton>
                                    </div>
                                  </td>
                                  <td className="p-2">{activity.rate}</td>
                                  <td className="p-2">{formatCurrency(activity.total)}</td>
                                  <td className="p-2">
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      startIcon={<Add />}
                                      onClick={() => openAddDialog('workItem', packageIndex, activityIndex)}
                                    >
                                      Add Work Item
                                    </Button>
                                  </td>
                                </tr>
                                {expandedActivities[`${packageIndex}-${activityIndex}`] && activity.workItems.map((item, itemIndex) => (
                                  <tr key={itemIndex}>
                                    <td className="p-2 pl-16">
                                      <Checkbox
                                        checked={selectedItems[`${packageIndex}-${activityIndex}-${itemIndex}`] || false}
                                        onChange={() => handleCheckboxChange(packageIndex, activityIndex, itemIndex)}
                                      />
                                      {item}
                                    </td>
                                    <td className="p-2"></td>
                                    <td className="p-2"></td>
                                    <td className="p-2"></td>
                                  </tr>
                                ))}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <Button variant="outlined" color="primary" onClick={addPackage} className="mt-4">
            Add Package
          </Button>
        </div>
      ) : (
        <div>Hello World!</div>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{dialogType === 'activity' ? 'Add New Activity' : 'Add New Work Item'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={dialogType === 'activity' ? 'Activity Name' : 'Work Item Name'}
            type="text"
            fullWidth
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddItem}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WorkOrderCreator;