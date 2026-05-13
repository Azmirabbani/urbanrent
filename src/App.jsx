import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import NotFoundPage from "@/pages/NotFoundPage.jsx";
import { Navbar } from "@/components/Navbar.jsx";
import { Footer } from "@/components/Footer.jsx";
import { ProtectedRoute } from "@/components/ProtectedRoute.jsx";
import { RoleRoute } from "@/components/RoleRoute.jsx";
import { AdminRoute } from "@/components/AdminRoute.jsx";
import { PageTransition } from "@/components/PageTransition.jsx";

import LandingPage from "@/features/listings/LandingPage.jsx";
import ExplorePage from "@/features/listings/ExplorePage.jsx";
import ListingDetailPage from "@/features/listings/ListingDetailPage.jsx";

import SigninPage from "@/features/auth/SigninPage.jsx";
import SignupPage from "@/features/auth/SignupPage.jsx";
import ForgotPasswordPage from "@/features/auth/ForgotPasswordPage.jsx";

import BookingPage from "@/features/booking/BookingPage.jsx";
import MyBookingsPage from "@/features/booking/MyBookingsPage.jsx";

import DashboardPage from "@/features/owner/DashboardPage.jsx";
import MyListingsPage from "@/features/owner/MyListingsPage.jsx";
import ListingFormPage from "@/features/owner/ListingFormPage.jsx";
import OwnerBookingsPage from "@/features/owner/OwnerBookingsPage.jsx";
import EarningsPage from "@/features/owner/EarningsPage.jsx";

import AdminDashboardPage from "@/features/admin/AdminDashboardPage.jsx";
import UserManagementPage from "@/features/admin/UserManagementPage.jsx";
import ListingModerationPage from "@/features/admin/ListingModerationPage.jsx";
import AnalyticsPage from "@/features/admin/AnalyticsPage.jsx";

import ProfilePage from "@/features/profile/ProfilePage.jsx";
import ChatLayout from "@/features/chat/ChatLayout.jsx";
import FavoritesPage from "@/features/listings/FavoritesPage.jsx";

function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <Navbar />
      <main className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}

// Layout tanpa footer, full height � untuk chat
function ChatShell() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar />
      <main className="flex min-h-0 flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* -- Main shell dengan footer -- */}
      <Route element={<AppShell />}>
        <Route index element={<LandingPage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="listings/:id" element={<ListingDetailPage />} />

        <Route path="signin" element={<SigninPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />

        <Route
          path="listings/:listingId/book"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="Profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="favorites" element={<FavoritesPage />} />

        <Route
          path="Owner"
          element={
            <ProtectedRoute>
              <RoleRoute allow={["owner"]} fallbackTo="/">
                <Outlet />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="listings" element={<MyListingsPage />} />
          <Route path="listings/new" element={<ListingFormPage />} />
          <Route path="listings/:id/edit" element={<ListingFormPage />} />
          <Route path="bookings" element={<OwnerBookingsPage />} />
          <Route path="earnings" element={<EarningsPage />} />
        </Route>

        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <Outlet />
              </AdminRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="listings" element={<ListingModerationPage />} />
          <Route path="Analytics" element={<AnalyticsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* -- Chat shell � split layout, tanpa footer -- */}
      <Route element={<ChatShell />}>
        <Route
          path="messages"
          element={
            <ProtectedRoute>
              <ChatLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="messages/:conversationId"
          element={
            <ProtectedRoute>
              <ChatLayout />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
