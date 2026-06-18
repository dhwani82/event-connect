import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import VendorsPage from './pages/VendorsPage';
import VendorDetailPage from './pages/VendorDetailPage';
import EventsPage from './pages/EventsPage';
import CreateEventPage from './pages/CreateEventPage';
import NotificationsPage from './pages/NotificationsPage';
import SignupPage from './pages/SignupPage';
import SignupCustomerPage from './pages/SignupCustomerPage';
import SignupVendorPage from './pages/SignupVendorPage';
import LoginPage from './pages/LoginPage';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import VendorDashboardPage from './pages/VendorDashboardPage';

function NavbarWrapper() {
  const { pathname } = useLocation();
  const hide = ['/dashboard', '/signup', '/login'].some(p => pathname.startsWith(p));
  if (hide) return null;
  return <Navbar />;
}

export default function App() {
  return (
    <BrowserRouter>
      <NavbarWrapper />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/vendors" element={<VendorsPage />} />
        <Route path="/vendors/:id" element={<VendorDetailPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/create" element={<CreateEventPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup/customer" element={<SignupCustomerPage />} />
        <Route path="/signup/vendor" element={<SignupVendorPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard/customer" element={<CustomerDashboardPage />} />
        <Route path="/dashboard/vendor" element={<VendorDashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
