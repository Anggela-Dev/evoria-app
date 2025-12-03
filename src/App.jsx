import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventDetailPage from "./pages/EventDetailPage";
import Dashboard from "./pages/Dashboard";
import TabBar from "./components/TabBar";
import ProtectedRoute from "./components/ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import MyEvents from "./pages/MyEvents";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEvents from "./pages/AdminEvents";
import AdminTabBar from "./components/AdminTabBar";
import AdminEventDetail from "./pages/AdminEventDetail";
import AttendancePage from "./pages/AttendancePage";


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // cek user tersimpan di localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  return (
    <Router>
      <div style={{ paddingBottom: "60px" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/myevents" element={<MyEvents />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/event/:id" element={<AdminEventDetail />} />
          <Route path="/admin/events/:id/attendance" element={<AttendancePage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
                  <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

          <Route
            path="/event/:id"
            element={
              <ProtectedRoute>
                <EventDetailPage />
              </ProtectedRoute>
            }
          />
                <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
  path="/admin/events"
  element={
    <ProtectedRoute>
      <AdminEvents />
    </ProtectedRoute>
  }
/>
        </Routes>
      </div>

    

      {/* 🧠 TabBar tampil hanya kalau user ada */}
{user && (
  user.role === "admin" ? (
    <AdminTabBar setUser={setUser} />
  ) : (
    <TabBar setUser={setUser} />
  )
)}

    </Router>
  );
}

export default App;
