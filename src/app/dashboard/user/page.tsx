'use client';

import React, { useState } from 'react';
import {
  Box, Button, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, TextField, Typography, Tooltip
} from '@mui/material';
import { Add, Edit, Delete, Block } from '@mui/icons-material';
import UserFormDialog from './AddUser';

const mockUsers = [
  { id: 1, name: 'super_admin', email: 'superadmin@gmail.com', phone: '87945646553', role: 'superAdmin001', status: 'Active' },
  { id: 2, name: 'kalyan', email: 'kalyan@gmail.com', phone: '798756456798', role: 'admin', status: 'Active' },
  { id: 3, name: 'admin', email: 'admin@gmail.com', phone: '7987879849458', role: 'admin', status: 'Active' },
  { id: 4, name: 'testuser', email: 'mohithpoojary10@gmail.com', phone: '789789789789', role: 'testRole', status: 'Active' }
];

export default function UserManagementPage(): React.JSX.Element {
  const [openForm, setOpenForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setOpenForm(true);
  };

  return (
    <Box >
      <Typography variant="h6" mb={2}>Users</Typography>

      {/* Top Bar */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField size="small" placeholder="Search 4 records..." />
        <Button variant="contained" startIcon={<Add />} onClick={() => { setOpenForm(true); setSelectedUser(null); }}>
          Add User
        </Button>
      </Stack>

      {/* Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.role}</TableCell>
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
                      {user.status}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Edit">
                        <IconButton color="primary" onClick={() => handleEdit(user)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error">
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Deactivate">
                        <IconButton color="warning">
                          <Block fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={mockUsers.length}
          page={0}
          onPageChange={() => {}}
          rowsPerPage={5}
          rowsPerPageOptions={[5]}
          onRowsPerPageChange={() => {}}
        />
      </Paper>

      <UserFormDialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        user={selectedUser}
      />
    </Box>
  );
}
