'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Add, Delete, Edit, Block } from '@mui/icons-material';
import AddRoleDialog from './AddRoleForm.tsx';

const initialRoles = [
  { id: 1, name: 'superAdmin001', description: 'Im supreem', status: 'Active' },
  { id: 2, name: 'testRole', description: '', status: 'Active' },
  { id: 3, name: 'admin', description: "i'm admin", status: 'Active' },
];

export default function UserRolePage(): React.JSX.Element {
  const [openAddRole, setOpenAddRole] = useState(false);
  const [editingRole, setEditingRole] = useState<any | null>(null);
  const [roles, setRoles] = useState(initialRoles);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>
        User Roles
      </Typography>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField size="small" placeholder="Search 3 records..." />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setEditingRole(null);
            setOpenAddRole(true);
          }}
        >
          Add Role
        </Button>
      </Stack>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Role Name</TableCell>
                <TableCell>Role Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.id}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <Typography
                      variant="caption"
                      sx={{
                        bgcolor: '#e6f4ea',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '6px',
                        color: 'green',
                        fontWeight: 500,
                      }}
                    >
                      {role.status}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setEditingRole(role);
                          setOpenAddRole(true);
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                      <IconButton color="warning">
                        <Block fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={roles.length}
          page={0}
          onPageChange={() => {}}
          rowsPerPage={5}
          rowsPerPageOptions={[5]}
          onRowsPerPageChange={() => {}}
        />
      </Paper>

      <AddRoleDialog
        open={openAddRole}
        onClose={() => {
          setOpenAddRole(false);
          setEditingRole(null);
        }}
        initialValues={
          editingRole
            ? {
                roleName: editingRole.name,
                description: editingRole.description,
                permissions: [], // Inject real saved permissions if available
              }
            : undefined
        }
        onSave={(updated) => {
          if (editingRole) {
            setRoles((prev) =>
              prev.map((r) =>
                r.id === editingRole.id
                  ? { ...r, name: updated.roleName, description: updated.description }
                  : r
              )
            );
          } else {
            const newId = roles.length + 1;
            setRoles((prev) => [
              ...prev,
              {
                id: newId,
                name: updated.roleName,
                description: updated.description,
                status: 'Active',
              },
            ]);
          }
          setOpenAddRole(false);
          setEditingRole(null);
        }}
      />
    </Box>
  );
}
