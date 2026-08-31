import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeApi, authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Stall {
  id: number;
  stallCode: string;
  size: string;
  location: string;
  price: number;
  isAvailable: boolean;
  rowPosition: number;
  columnPosition: number;
}

interface ReservationRequest {
  id: number;
  username: string;
  vendorName: string;
  businessName: string;
  contactPhone: string;
  eventName: string;
  reservationDate: string;
  stallType: string;
  preferredStallSize: string;
  numberOfStalls: number;
  businessCategory: string;
  specialRequirements: string;
  status: string;
  stallCode: string;
  qrCode: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [reservations, setReservations] = useState<ReservationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'requests' | 'stalls'>('requests');
  const [showQR, setShowQR] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stallsRes, reservationsRes] = await Promise.allSettled([
        employeeApi.getAllStalls(),
        employeeApi.getAllReservations(),
      ]);
      if (stallsRes.status === 'fulfilled') setStalls(stallsRes.value.data);
      if (reservationsRes.status === 'fulfilled') setReservations(reservationsRes.value.data);
    } catch (err) {
      console.error('Failed to fetch organizer data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      setUpdatingId(id);
      await employeeApi.updateStatus(id, newStatus);
      fetchData();
    } catch (err) {
      alert('Failed to update reservation status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.warn("Logout API notice", e);
    } finally {
      logout();
      navigate('/login');
    }
  };

  const getSizeColor = (size: string, isAvailable: boolean) => {
    if (!isAvailable) return 'bg-slate-400 border-slate-500 text-white';

    switch (size) {
      case 'SMALL':
        return 'bg-emerald-100 border-emerald-500';
      case 'MEDIUM':
        return 'bg-sky-100 border-sky-500';
      case 'LARGE':
        return 'bg-purple-100 border-purple-500';
      default:
        return 'bg-slate-100 border-slate-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">APPROVED</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-800">REJECTED</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-800">CANCELLED</span>;
      default:
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800">PENDING</span>;
    }
  };

  // Group stalls by rows
  const stallsByRow = stalls.reduce((acc, stall) => {
    if (!acc[stall.rowPosition]) {
      acc[stall.rowPosition] = [];
    }
    acc[stall.rowPosition].push(stall);
    return acc;
  }, {} as Record<number, Stall[]>);

  const stats = {
    totalRequests: reservations.length,
    pendingRequests: reservations.filter((r) => r.status === 'PENDING').length,
    approvedRequests: reservations.filter((r) => r.status === 'APPROVED').length,
    totalStalls: stalls.length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-lg font-semibold text-slate-300">Loading Organizer Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-indigo-400">Exhibition Organizer Portal</h1>
            <p className="text-xs text-slate-400">Manage Venue, Stalls & Vendor Stall Requests</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-300">Organizer: <strong className="text-white">{user?.businessName || 'Exhibition Authority'}</strong></span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Requests</p>
            <p className="text-3xl font-extrabold text-slate-800 mt-1">{stats.totalRequests}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending Review</p>
            <p className="text-3xl font-extrabold text-amber-600 mt-1">{stats.pendingRequests}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Approved Requests</p>
            <p className="text-3xl font-extrabold text-emerald-600 mt-1">{stats.approvedRequests}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Venue Stalls</p>
            <p className="text-3xl font-extrabold text-indigo-600 mt-1">{stats.totalStalls}</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition ${
              activeTab === 'requests'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            📋 Vendor Reservation Requests ({reservations.length})
          </button>
          <button
            onClick={() => setActiveTab('stalls')}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition ${
              activeTab === 'stalls'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            🏛️ Venue Stall Map
          </button>
        </div>

        {/* Content */}
        {activeTab === 'requests' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Vendor Stall Reservation Requests</h2>
            {reservations.length === 0 ? (
              <p className="text-slate-500 text-center py-12">No vendor reservation requests submitted yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50">
                      <th className="py-3.5 px-4">Req #</th>
                      <th className="py-3.5 px-4">Vendor Username</th>
                      <th className="py-3.5 px-4">Business & Contact</th>
                      <th className="py-3.5 px-4">Event Name</th>
                      <th className="py-3.5 px-4">Res. Date</th>
                      <th className="py-3.5 px-4">Stall Specs</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {reservations.map((res) => (
                      <tr key={res.id} className="hover:bg-slate-50 transition">
                        <td className="py-4 px-4 font-mono font-bold text-slate-700">#{res.id}</td>
                        <td className="py-4 px-4 font-mono font-semibold text-indigo-700">{res.username}</td>
                        <td className="py-4 px-4">
                          <p className="font-bold text-slate-800">{res.businessName}</p>
                          <p className="text-xs text-slate-500">{res.vendorName} ({res.contactPhone})</p>
                        </td>
                        <td className="py-4 px-4 font-medium text-slate-800">{res.eventName}</td>
                        <td className="py-4 px-4 font-medium text-slate-700">{res.reservationDate}</td>
                        <td className="py-4 px-4">
                          <p className="font-medium text-slate-800">{res.stallType} ({res.preferredStallSize})</p>
                          <p className="text-xs text-slate-500">{res.numberOfStalls} Stall(s)</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-block px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-md">
                            {res.businessCategory}
                          </span>
                        </td>
                        <td className="py-4 px-4">{getStatusBadge(res.status)}</td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex gap-2 justify-end">
                            {res.status === 'PENDING' && (
                              <>
                                <button
                                  disabled={updatingId === res.id}
                                  onClick={() => handleStatusUpdate(res.id, 'APPROVED')}
                                  className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                                >
                                  Approve
                                </button>
                                <button
                                  disabled={updatingId === res.id}
                                  onClick={() => handleStatusUpdate(res.id, 'REJECTED')}
                                  className="px-3 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-lg hover:bg-rose-700 transition disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {res.qrCode && (
                              <button
                                onClick={() => setShowQR(res.qrCode)}
                                className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-lg transition"
                              >
                                QR Pass
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Exhibition Venue Map Layout</h2>

            {/* Legend */}
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-emerald-100 border-2 border-emerald-500 rounded"></div>
                <span className="text-xs text-slate-600">Small Stall</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-sky-100 border-2 border-sky-500 rounded"></div>
                <span className="text-xs text-slate-600">Medium Stall</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-purple-100 border-2 border-purple-500 rounded"></div>
                <span className="text-xs text-slate-600">Large Stall</span>
              </div>
            </div>

            {/* Stall Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-fit space-y-4">
                {Object.entries(stallsByRow).map(([rowIdx, rowStalls]) => (
                  <div key={rowIdx} className="flex items-center gap-4">
                    <div className="w-16 text-center font-bold text-slate-700 text-sm">
                      Zone {String.fromCharCode(65 + parseInt(rowIdx))}
                    </div>
                    <div className="flex gap-3">
                      {rowStalls
                        .sort((a, b) => a.columnPosition - b.columnPosition)
                        .map((stall) => (
                          <div
                            key={stall.id}
                            className={`w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center ${getSizeColor(
                              stall.size,
                              stall.isAvailable
                            )}`}
                          >
                            <span className="font-bold text-sm">{stall.stallCode}</span>
                            <span className="text-xs mt-1">{stall.size.charAt(0)}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* QR Pass Viewer Modal */}
      {showQR && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          onClick={() => setShowQR(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-slate-800 mb-2">Vendor Digital QR Pass</h3>
            <p className="text-xs text-slate-500 mb-4">Organizer Verification Pass</p>
            <div className="flex justify-center mb-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <img
                src={`data:image/png;base64,${showQR}`}
                alt="QR Pass"
                className="w-56 h-56"
              />
            </div>
            <button
              onClick={() => setShowQR(null)}
              className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
