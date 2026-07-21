'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

interface AddRoleDialogProps {
  open: boolean;
  onClose: () => void;
  existingRole?: { name: string; description: string } | null;
}

interface SubModulePermission {
  name: string;
  canView: boolean;
  canActivate: boolean;
  canUpdate: boolean;
  isNA?: boolean;
}

interface ModuleConfig {
  moduleName: string;
  subModules: SubModulePermission[];
}

const defaultModules: ModuleConfig[] = [
  {
    moduleName: 'Administration',
    subModules: [
      { name: 'Users', canView: false, canActivate: false, canUpdate: false },
      { name: 'User Role', canView: false, canActivate: false, canUpdate: false },
      { name: 'Notification', canView: false, canActivate: false, canUpdate: false, isNA: true },
    ],
  },
  {
    moduleName: 'Persona Vision',
    subModules: [{ name: 'Vision Overview', canView: false, canActivate: false, canUpdate: false }],
  },
  {
    moduleName: 'Persona 360',
    subModules: [{ name: 'Customer Intelligence', canView: false, canActivate: false, canUpdate: false }],
  },
  {
    moduleName: 'Persona Grid',
    subModules: [{ name: 'Audience Segmentation', canView: false, canActivate: false, canUpdate: false }],
  },
  {
    moduleName: 'Persona Retain',
    subModules: [
      { name: 'Churn Insights', canView: false, canActivate: false, canUpdate: false },
      { name: 'Churn Score Reports', canView: false, canActivate: false, canUpdate: false },
      { name: 'Churn What if', canView: false, canActivate: false, canUpdate: false },
    ],
  },
  {
    moduleName: 'Persona Lift',
    subModules: [
      { name: 'NBO Insights', canView: false, canActivate: false, canUpdate: false },
      { name: 'Smart Offer X', canView: false, canActivate: false, canUpdate: false },
    ],
  },
];

export default function AddRoleDialog({
  open,
  onClose,
  existingRole,
}: AddRoleDialogProps): React.JSX.Element {
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState<ModuleConfig[]>(defaultModules);
  const [selectedModuleName, setSelectedModuleName] = useState(defaultModules[0].moduleName);

 useEffect(() => {
  if (existingRole) {
    setRoleName(existingRole.name);
    setDescription(existingRole.description);

    // Enable all permissions if editing
    const updatedPermissions = defaultModules.map((module) => ({
      ...module,
      subModules: module.subModules.map((sm) => ({
        ...sm,
        canView: true,
        canActivate: !sm.isNA, // Only if not NA
        canUpdate: true,
      })),
    }));
    setPermissions(updatedPermissions);
  } else {
    setRoleName('');
    setDescription('');
    setPermissions(defaultModules); // reset
  }
}, [existingRole]);


  const selectedModule = permissions.find((mod) => mod.moduleName === selectedModuleName)!;

  const handlePermissionChange = (
    moduleName: string,
    subModuleName: string,
    field: keyof SubModulePermission
  ) => {
    setPermissions((prev) =>
      prev.map((module) =>
        module.moduleName === moduleName
          ? {
              ...module,
              subModules: module.subModules.map((sm) =>
                sm.name === subModuleName ? { ...sm, [field]: !sm[field] } : sm
              ),
            }
          : module
      )
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{existingRole ? 'Edit Role' : 'Add Role'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <TextField
              required
              label="Role Name"
              fullWidth
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Role Description"
              fullWidth
              multiline
              minRows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2 }} />

        <Stack direction="row" spacing={2}>
          <Box sx={{ width: '35%' }}>
            {permissions.map((module) => (
              <Box
                key={module.moduleName}
                onClick={() => setSelectedModuleName(module.moduleName)}
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: selectedModuleName === module.moduleName ? 'primary.light' : 'transparent',
                  cursor: 'pointer',
                  mb: 1,
                }}
              >
                <Typography variant="body1" fontWeight={500}>
                  {module.moduleName}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ flex: 1 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Permissions
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Typography variant="caption">SUBMODULE NAME</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="caption">VIEW</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="caption">ACTIVATE</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="caption">SAVE / UPDATE</Typography>
                </Grid>

                {selectedModule.subModules.map((sub) => (
                  <React.Fragment key={sub.name}>
                    <Grid item xs={4}>
                      <Typography>{sub.name}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Checkbox
                        checked={sub.canView}
                        onChange={() => handlePermissionChange(selectedModule.moduleName, sub.name, 'canView')}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      {sub.isNA ? (
                        <Typography color="error">NA</Typography>
                      ) : (
                        <Checkbox
                          checked={sub.canActivate}
                          onChange={() => handlePermissionChange(selectedModule.moduleName, sub.name, 'canActivate')}
                        />
                      )}
                    </Grid>
                    <Grid item xs={3}>
                      <Checkbox
                        checked={sub.canUpdate}
                        onChange={() => handlePermissionChange(selectedModule.moduleName, sub.name, 'canUpdate')}
                      />
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </Paper>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button variant="contained" color="primary">
          Save Role
        </Button>
      </DialogActions>
    </Dialog>
  );
}
