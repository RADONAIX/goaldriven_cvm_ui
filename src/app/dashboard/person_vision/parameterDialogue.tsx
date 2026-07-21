import React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';

interface UserData {
  name: string;
  msisdn: string;
  email: string;
}

interface ParameterDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  parameterLabel: string;
}

const dummyData: UserData[] = Array.from({ length: 23 }, (_, i) => ({
  name: `User ${i + 1}`,
  msisdn: `98765432${i.toString().padStart(2, '0')}`,
  email: `user${i + 1}@example.com`,
}));

const ParameterDetailsDialog: React.FC<ParameterDetailsDialogProps> = ({ open, onClose, parameterLabel }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2">{parameterLabel} - Affected Users</Typography>
          <Button onClick={onClose} sx={{ minWidth: 'auto' }}>
            x
          </Button>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
          Showing {dummyData.length} users affected
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ mt: 1, borderRadius: 2, boxShadow: 1 }}>
          <Table size="small" sx={{ minWidth: 400 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>MSISDN</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dummyData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.msisdn}</TableCell>
                  <TableCell>{row.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={dummyData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ParameterDetailsDialog;
