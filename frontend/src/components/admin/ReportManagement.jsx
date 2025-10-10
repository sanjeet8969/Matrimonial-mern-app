import React, { useState, useEffect } from 'react';
import { getAllReports, resolveReport } from '../../api/adminApi';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Loader from '../common/Loader';
import Select from '../common/Select';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [actionTaken, setActionTaken] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadReports();
  }, [filter]);

  const loadReports = async () => {
    try {
      const response = await getAllReports(filter);
      setReports(response.data.reports);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!actionTaken.trim()) {
      toast.error('Please specify action taken');
      return;
    }

    try {
      await resolveReport(selectedReport._id, actionTaken, adminNotes);
      toast.success('Report resolved successfully');
      setShowResolveModal(false);
      setActionTaken('');
      setAdminNotes('');
      setSelectedReport(null);
      loadReports();
    } catch (error) {
      toast.error('Failed to resolve report');
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Report Management</h2>
        <Select
          name="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          options={[
            { value: '', label: 'All Reports' },
            { value: 'pending', label: 'Pending' },
            { value: 'reviewing', label: 'Under Review' },
            { value: 'resolved', label: 'Resolved' }
          ]}
        />
      </div>

      {reports.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500">No reports found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Badge
                      variant={
                        report.status === 'resolved'
                          ? 'success'
                          : report.status === 'pending'
                          ? 'warning'
                          : 'info'
                      }
                    >
                      {report.status}
                    </Badge>
                    <Badge variant="danger">{report.reason.replace('_', ' ').toUpperCase()}</Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Reporter:</span> {report.reporter?.email}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Reported User:</span> {report.reported?.email}
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">Description:</span> {report.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    Reported on {format(new Date(report.createdAt), 'dd MMM yyyy, HH:mm')}
                  </p>

                  {report.actionTaken && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-900 mb-1">Action Taken:</p>
                      <p className="text-sm text-green-700">{report.actionTaken}</p>
                      {report.adminNotes && (
                        <p className="text-xs text-green-600 mt-1">Notes: {report.adminNotes}</p>
                      )}
                    </div>
                  )}
                </div>

                {report.status !== 'resolved' && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedReport(report);
                      setShowResolveModal(true);
                    }}
                  >
                    Resolve
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resolve Modal */}
      <Modal
        isOpen={showResolveModal}
        onClose={() => {
          setShowResolveModal(false);
          setActionTaken('');
          setAdminNotes('');
          setSelectedReport(null);
        }}
        title="Resolve Report"
      >
        <div className="space-y-4">
          <Input
            label="Action Taken"
            value={actionTaken}
            onChange={(e) => setActionTaken(e.target.value)}
            placeholder="e.g., User warned, Account suspended, etc."
            required
          />
          <div>
            <label className="label">Admin Notes (Optional)</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows="3"
              className="input-field resize-none"
              placeholder="Additional notes..."
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowResolveModal(false);
                setActionTaken('');
                setAdminNotes('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleResolve}>Resolve Report</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReportManagement;
