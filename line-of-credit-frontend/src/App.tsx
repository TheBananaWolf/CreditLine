import React, { useState, useEffect } from 'react';
import './App.css';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { api } from './services/api.ts';
import { Application, ApplicationState } from './types.ts';

function App() {
  const [username, setUsername] = useState('');
  const [applications, setApplications] = useState<Application[]>([]);
  const [newApplicationData, setNewApplicationData] = useState({
    requestedAmount: '',
    expressDelivery: false,
  });
  const [repaymentData, setRepaymentData] = useState({
    applicationId: '',
    amount: '',
  });
  const [isRepaymentDialogOpen, setIsRepaymentDialogOpen] = useState(false);

  const loadApplications = async () => {
    if (!username) return;
    try {
      const data = await api.getUserApplications(username);
      setApplications(data);
    } catch (error: any) {
      console.error('Error loading applications:', error);
      alert(error.response?.data?.error || 'Failed to load applications');
    }
  };

  useEffect(() => {
    loadApplications();
  }, [username]);

  const handleCreateApplication = async () => {
    try {
      await api.createApplication(
        username,
        Number(newApplicationData.requestedAmount),
        newApplicationData.expressDelivery
      );
      setNewApplicationData({ requestedAmount: '', expressDelivery: false });
      loadApplications();
      alert('Application created successfully!');
    } catch (error: any) {
      console.error('Error creating application:', error);
      alert(error.response?.data?.error || 'Failed to create application');
    }
  };

  const handleDisburse = async (applicationId: string) => {
    try {
      await api.disburse(applicationId);
      loadApplications();
      alert('Funds disbursed successfully!');
    } catch (error: any) {
      console.error('Error disbursing funds:', error);
      const errorMessage = error.response?.data?.error || 'Failed to disburse funds';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleRepay = async () => {
    try {
      await api.repay(repaymentData.applicationId, Number(repaymentData.amount));
      setIsRepaymentDialogOpen(false);
      setRepaymentData({ applicationId: '', amount: '' });
      loadApplications();
      alert('Repayment processed successfully!');
    } catch (error: any) {
      console.error('Error processing repayment:', error);
      alert(error.response?.data?.error || 'Failed to process repayment');
    }
  };

  const handleCancel = async (applicationId: string) => {
    try {
      await api.cancel(applicationId);
      loadApplications();
      alert('Application cancelled successfully!');
    } catch (error: any) {
      console.error('Error cancelling application:', error);
      alert(error.response?.data?.error || 'Failed to cancel application');
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      await api.reject(applicationId);
      loadApplications();
      alert('Application rejected successfully!');
    } catch (error: any) {
      console.error('Error rejecting application:', error);
      alert(error.response?.data?.error || 'Failed to reject application');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Line of Credit Management
        </Typography>

        <Paper sx={{ p: 2, mb: 2 }}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
        </Paper>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Create New Application
          </Typography>
          <TextField
            label="Requested Amount"
            type="number"
            value={newApplicationData.requestedAmount}
            onChange={(e) =>
              setNewApplicationData({ ...newApplicationData, requestedAmount: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <FormControlLabel
            control={
              <Switch
                checked={newApplicationData.expressDelivery}
                onChange={(e) =>
                  setNewApplicationData({
                    ...newApplicationData,
                    expressDelivery: e.target.checked
                  })
                }
              />
            }
            label="Express Delivery (3 days)"
          />
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleCreateApplication}
              disabled={!username || !newApplicationData.requestedAmount}
            >
              Create Application
            </Button>
          </Box>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Application ID</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Requested Amount</TableCell>
                <TableCell>Outstanding Balance</TableCell>
                <TableCell>Express Delivery</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.applicationId}>
                  <TableCell>{application.applicationId}</TableCell>
                  <TableCell>{application.state}</TableCell>
                  <TableCell>${application.requestedAmount}</TableCell>
                  <TableCell>${application.outstandingBalance}</TableCell>
                  <TableCell>{application.expressDelivery ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    {application.state === ApplicationState.OPEN && (
                      <>
                        <Button
                          size="small"
                          onClick={() => handleDisburse(application.applicationId)}
                        >
                          Disburse
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleCancel(application.applicationId)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleReject(application.applicationId)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {application.state === ApplicationState.OUTSTANDING && (
                      <Button
                        size="small"
                        onClick={() => {
                          setRepaymentData({ applicationId: application.applicationId, amount: '' });
                          setIsRepaymentDialogOpen(true);
                        }}
                      >
                        Repay
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={isRepaymentDialogOpen} onClose={() => setIsRepaymentDialogOpen(false)}>
          <DialogTitle>Make Repayment</DialogTitle>
          <DialogContent>
            <TextField
              label="Repayment Amount"
              type="number"
              value={repaymentData.amount}
              onChange={(e) => setRepaymentData({ ...repaymentData, amount: e.target.value })}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsRepaymentDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRepay} variant="contained">
              Submit Repayment
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default App;