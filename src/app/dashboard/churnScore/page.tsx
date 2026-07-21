'use client';

import React, { useEffect, useState } from 'react';
import { useSnackbar } from '@/app/snack';
import {
  Button,
  Dialog,
  DialogActions,
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
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';

import { ChurnReport } from '@/types/nav';
import { getChurnReportXAI } from '@/hooks/server-actions/churnReport';
import { fetchChurnReportData } from '@/hooks/server-actions/churnScore';
import NavHeaders from '@/components/navHeaders';

import ChurnExplanationDialog from './ChurnExplanationDialog';

export default function Page(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [XAIdata, setXAIData] = useState<string | null>(null);
  const [rows, setRows] = useState<ChurnReport[]>([]);
  const [page, setPage] = useState(0); // Page number
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
  const { showSnackbar } = useSnackbar();

  // Fetch the churn reports from the API
  useEffect(() => {
    const fetchChurnReports = async () => {
      try {
        const data = await fetchChurnReportData(); // Call the server action to fetch tickets
        setRows(data);
      } catch (error) {
        showSnackbar(error as string, 'error');
      }
    };

    fetchChurnReports();
  }, []);

  // Filter rows based on search term
  const filteredRows = rows.filter((row) => row.msisdn.includes(searchTerm));

  // Pagination: Calculate the rows to display on the current page
  const rowsToDisplay = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleClickOpen = async (data: ChurnReport) => {
    try {
      setOpenDialog(true);
      const res = await getChurnReportXAI(data);
      setXAIData(res?.data?.explanation ?? null);
    } catch (error) {
      console.log(error, 'errorr');
      showSnackbar(error?.message ?? ('Something went wrong' as string), 'error');
      setOpenDialog(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle page change
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page is changed
  };

  return (
    <Paper>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <NavHeaders text="Churn Score Reports" />

        <TextField
          variant="outlined"
          label="Search MSISDN"
          size="small"
          style={{ width: '300px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Stack>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <TableSortLabel>MSISDN</TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel>Full Name</TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel>Age</TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel>Total Revenue</TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel>Avg. Monthly Spending</TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel>Churn Probability</TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel>Churn Risk</TableSortLabel>
              </TableCell>
              {/* <TableCell align="center">XAI</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsToDisplay.map((row) => (
              <TableRow key={row.msisdn}>
                <TableCell align="center">{row.msisdn}</TableCell>
                <TableCell align="center">{row.full_name}</TableCell>
                <TableCell align="center">{row.age}</TableCell>
                <TableCell align="center">${row.total_revenue_generated_2}</TableCell>
                <TableCell align="center">${row.average_monthly_spending_2}</TableCell>
                <TableCell align="center">{row.churn_probability}</TableCell>
                <TableCell align="center">{row.churn_risk}</TableCell>
                {/* <TableCell align="center">
                  <Button variant="contained" size="small" onClick={() => handleClickOpen(row)}>
                    XAI
                  </Button>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {openDialog && (
        <ChurnExplanationDialog
          XAIdata={XAIdata}
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
            setXAIData(null);
          }}
        />
      )}

      {/* 
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>MSISDN: {dialogTitle}</DialogTitle>
        <DialogContent>
          <Typography variant="caption"> {XAIdata}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog> */}
    </Paper>
  );
}
