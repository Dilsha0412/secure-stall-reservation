import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservationApi, userApi, authApi } from '../services/api';
import { useAuth, type User } from '../context/AuthContext';

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

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<User | null>(user);
  const [reservations, setReservations] = useState<ReservationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showQR, setShowQR] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resReservations, resProfile] = await Promise.allSettled([
        reservationApi.getMyReservations(),
        userApi.getProfile(),
      ]);

      if (resReservations.status === 'fulfilled') {
        setReservations(resReservations.value.data);
      }
      if (resProfile.status === 'fulfilled') {
        setProfile(resProfile.value.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
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

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">APPROVED</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-800">REJECTED</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-800">CANCELLED</span>;
      default:
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800">PENDING APPROVAL</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-lg font-semibold text-slate-600">Loading vendor dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-indigo-700">Stall Vendor Portal</h1>
            <p className="text-xs text-gray-500">Exhibition Stall Reservation Platform</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium text-sm"
            >
              <span>👤 Profile</span>
            </button>
            <button
              onClick={() => navigate('/reserve')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
            >
              + Submit New Request
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Authenticated Profile Banner */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Authenticated Vendor Profile</span>
              <h2 className="text-2xl font-bold text-gray-800">{profile?.businessName || user?.businessName || 'Vendor Business'}</h2>
              <p className="text-sm text-gray-500">Stall Vendor Account</p>
            </div>
            <button
              onClick={() => setShowProfileModal(true)}
              className="self-start md:self-auto text-sm text-indigo-600 hover:text-indigo-800 font-semibold underline"
            >
              View Full Profile Details →
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs text-gray-400 block">Username</span>
              <span className="font-mono font-semibold text-gray-800">{profile?.username || user?.username || 'N/A'}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs text-gray-400 block">Contact Name</span>
              <span className="font-semibold text-gray-800">{profile?.name || user?.name || 'N/A'}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs text-gray-400 block">Email Address</span>
              <span className="font-semibold text-gray-800 truncate block">{profile?.email || user?.email || 'N/A'}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs text-gray-400 block">Contact Number</span>
              <span className="font-semibold text-gray-800">{profile?.phone || user?.phone || 'N/A'}</span>
            </div>
          </div>
        </section>

        {/* My Stall Reservation Requests */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">My Stall Reservation Requests</h2>
              <p className="text-sm text-gray-500">Track and manage your submitted stall requests</p>
            </div>
            <button
              onClick={() => navigate('/reserve')}
              className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
            >
              + New Reservation Request
            </button>
          </div>

          {reservations.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 font-medium mb-3">No stall reservation requests found.</p>
              <button
                onClick={() => navigate('/reserve')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
              >
                Submit Your First Request
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reservations.map((res) => (
                <div
                  key={res.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition space-y-4"
                >
                  <div className="flex justify-between items-start border-b pb-3">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{res.eventName}</h3>
                      <p className="text-xs text-gray-400">Request ID: #{res.id}</p>
                    </div>
                    <div>{getStatusBadge(res.status)}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-xs text-gray-400 block">Reservation Date</span>
                      <span className="font-semibold text-gray-700">{res.reservationDate}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block">Stall Type</span>
                      <span className="font-semibold text-gray-700">{res.stallType}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block">Preferred Size</span>
                      <span className="font-semibold text-gray-700">{res.preferredStallSize}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block">Stalls Count</span>
                      <span className="font-semibold text-gray-700">{res.numberOfStalls} Stall(s)</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block">Business Category</span>
                      <span className="font-semibold text-gray-700">{res.businessCategory}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block">Vendor Username</span>
                      <span className="font-mono text-xs text-gray-700 font-semibold">{res.username}</span>
                    </div>
                  </div>

                  {res.specialRequirements && (
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-xs text-amber-900">
                      <span className="font-bold block mb-0.5">Special Requirements:</span>
                      <p>{res.specialRequirements}</p>
                    </div>
                  )}

                  {res.qrCode && (
                    <div className="pt-2 flex justify-between items-center border-t">
                      <span className="text-xs text-gray-400">Digital Entry QR Code Pass</span>
                      <button
                        onClick={() => setShowQR(res.qrCode)}
                        className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg font-bold transition"
                      >
                        View QR Pass
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Full Profile Information Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-gray-800 mb-1">User Profile Information</h3>
            <p className="text-xs text-gray-500 mb-6">Authenticated IdP Profile Details</p>

            <div className="space-y-4 text-sm">
              <div className="border-b pb-2">
                <span className="text-xs text-gray-400 block font-semibold uppercase">Username</span>
                <span className="text-base font-bold text-indigo-700 font-mono">{profile?.username || user?.username || 'N/A'}</span>
              </div>
              <div className="border-b pb-2">
                <span className="text-xs text-gray-400 block font-semibold uppercase">Full Name</span>
                <span className="text-base font-semibold text-gray-800">{profile?.name || user?.name || 'N/A'}</span>
              </div>
              <div className="border-b pb-2">
                <span className="text-xs text-gray-400 block font-semibold uppercase">Email Address</span>
                <span className="text-base font-semibold text-gray-800">{profile?.email || user?.email || 'N/A'}</span>
              </div>
              <div className="border-b pb-2">
                <span className="text-xs text-gray-400 block font-semibold uppercase">Contact Number</span>
                <span className="text-base font-semibold text-gray-800">{profile?.phone || user?.phone || 'N/A'}</span>
              </div>
              <div className="border-b pb-2">
                <span className="text-xs text-gray-400 block font-semibold uppercase">Organization / Business Name</span>
                <span className="text-base font-semibold text-gray-800">{profile?.businessName || user?.businessName || 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-semibold uppercase">User Role</span>
                <span className="inline-block px-3 py-1 mt-1 text-xs font-bold bg-indigo-100 text-indigo-800 rounded-full">
                  {profile?.userType || user?.userType || 'STALL_VENDOR'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowProfileModal(false)}
              className="mt-6 w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}

      {/* QR Code Pass Modal */}
      {showQR && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          onClick={() => setShowQR(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">Vendor Digital QR Pass</h3>
            <p className="text-xs text-gray-500 mb-4">Present at exhibition entrance for verified check-in</p>
            <div className="flex justify-center mb-4 p-4 bg-slate-50 rounded-2xl border border-gray-200">
              <img
                src={`data:image/png;base64,${showQR}`}
                alt="QR Pass Code"
                className="w-56 h-56"
              />
            </div>
            <button
              onClick={() => setShowQR(null)}
              className="w-full py-3 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-900 transition"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
