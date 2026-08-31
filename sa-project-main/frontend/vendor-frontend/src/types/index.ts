export interface User {
  email: string;
  userType: string;
  businessName: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  userType: string;
  businessName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  address: string;
}

export interface Stall {
  id: number;
  stallCode: string;
  size: 'SMALL' | 'MEDIUM' | 'LARGE';
  location: string;
  price: number;
  isAvailable: boolean;
  rowPosition: number;
  columnPosition: number;
}

export interface ReservationRequest {
  stallIds: number[];
}

export interface Reservation {
  id: number;
  stallCode: string;
  stallSize: string;
  qrCode: string;
  reservationDate: string;
  businessName: string;
}

export interface GenreRequest {
  genreName: string;
}
