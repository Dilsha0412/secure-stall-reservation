import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservationApi, userApi, type ReservationPayload } from '../services/api';
import { useAuth, type User } from '../context/AuthContext';

const PREDEFINED_EVENTS = [
  'Colombo International Book Fair 2026',
  'Tech Expo Sri Lanka 2026',
  'National Handicrafts & Culture Fair 2026',
  'Global Food & Beverage Exhibition 2026',
  'Sri Lanka Apparel & Textile Expo 2026',
];

const BUSINESS_CATEGORIES = [
  'Books & Stationery',
  'Food & Beverage',
  'Clothing & Fashion',
  'Electronics & Technology',
  'Handicrafts & Arts',
  'Services & Consulting',
  'Other',
];

const ReserveStall: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<User | null>(user);
  const [formData, setFormData] = useState<ReservationPayload>({
    eventName: PREDEFINED_EVENTS[0],
    reservationDate: new Date().toISOString().split('T')[0],
    stallType: 'Standard Stall',
    preferredStallSize: 'Medium',
    numberOfStalls: 1,
    businessCategory: BUSINESS_CATEGORIES[0],
    specialRequirements: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await userApi.getProfile();
      setProfile(res.data);
    } catch (err) {
      console.warn('Profile fetch warning, using session user details', err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'numberOfStalls' ? parseInt(value, 10) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.reservationDate < todayStr) {
      setError('Reservation Date must be on or after today\'s date.');
      return;
    }

    setSubmitting(true);

    try {
      await reservationApi.create(formData);
      setSuccess('Stall Reservation Request submitted successfully! View status in your dashboard.');
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string; details?: Record<string, string> } } };
      const msg = errorObj.response?.data?.message || 
                  (errorObj.response?.data?.details ? Object.values(errorObj.response.data.details).join(', ') : 'Reservation submission failed.');
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-indigo-700">Stall Vendor Portal</h1>
            <p className="text-sm text-gray-500">Submit Exhibition Stall Reservation Request</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/home')}
              className="px-4 py-2 text-indigo-600 font-semibold hover:bg-indigo-50 rounded-lg transition"
            >
              My Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* User Identity / IdP Header Card */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-indigo-200 mb-2">Authenticated IdP Identity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-indigo-200">Authenticated Username</p>
              <p className="text-lg font-bold">{profile?.username || user?.username || 'vendor_user'}</p>
            </div>
            <div>
              <p className="text-xs text-indigo-200">Vendor / Contact Name</p>
              <p className="text-lg font-bold">{profile?.name || user?.name || profile?.businessName || user?.businessName}</p>
            </div>
            <div>
              <p className="text-xs text-indigo-200">Email Address</p>
              <p className="text-lg font-bold truncate">{profile?.email || user?.email}</p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">Stall Reservation Request</h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
              <p className="font-bold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6">
              <p className="font-bold">Success</p>
              <p className="text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Authenticated Username Read-only Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Vendor Username (Identified from IdP)
              </label>
              <input
                type="text"
                disabled
                value={profile?.username || user?.username || ''}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-600 cursor-not-allowed font-mono text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">Automatically bound to your authenticated identity.</p>
            </div>

            {/* Exhibition / Event Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Exhibition / Event Name *
              </label>
              <select
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
              >
                {PREDEFINED_EVENTS.map((event, idx) => (
                  <option key={idx} value={event}>
                    {event}
                  </option>
                ))}
              </select>
            </div>

            {/* Reservation Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Reservation Date (Calendar Selection) *
              </label>
              <input
                type="date"
                name="reservationDate"
                min={todayStr}
                value={formData.reservationDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">Must be on or after today's date ({todayStr}).</p>
            </div>

            {/* Stall Type & Size Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Stall Type *
                </label>
                <select
                  name="stallType"
                  value={formData.stallType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
                >
                  <option value="Standard Stall">Standard Stall</option>
                  <option value="Premium Stall">Premium Stall</option>
                  <option value="Corner Stall">Corner Stall</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Preferred Stall Size *
                </label>
                <select
                  name="preferredStallSize"
                  value={formData.preferredStallSize}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
                >
                  <option value="Small">Small (3m x 3m)</option>
                  <option value="Medium">Medium (6m x 3m)</option>
                  <option value="Large">Large (9m x 3m)</option>
                </select>
              </div>
            </div>

            {/* Number of Stalls & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Number of Stalls Required *
                </label>
                <input
                  type="number"
                  name="numberOfStalls"
                  min="1"
                  max="5"
                  value={formData.numberOfStalls}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Business Category *
                </label>
                <select
                  name="businessCategory"
                  value={formData.businessCategory}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
                >
                  {BUSINESS_CATEGORIES.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Special Requirements */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Special Requirements or Comments
              </label>
              <textarea
                name="specialRequirements"
                rows={3}
                value={formData.specialRequirements}
                onChange={handleInputChange}
                placeholder="Specify power outlet needs, special lighting, custom display equipment, extra tables..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/home')}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting Request...' : 'Submit Reservation Request'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ReserveStall;
