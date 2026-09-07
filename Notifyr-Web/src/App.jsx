import { BrowserRouter, Routes, Route } from "react-router-dom";
import QrGeneratePage from "./pages/admin/QrGeneratePage";
import AdminLayout from "./components/admin/AdminLayout";
import RequireAuth from "./components/admin/RequireAuth";
import QrListPage from "./pages/admin/QrListPage";
import LoginPage from "./pages/admin/LoginPage";
import FinderScanPage from "./pages/finder/FinderScanPage";
import PublicLandingPage from "./pages/public/PublicLandingPage";
import ScanPage from "./pages/public/ScanPage";
import HowItWorksPage from "./pages/public/HowItWorksPage";
import GetTagsPage from "./pages/public/GetTagsPage";
import SupportPage from "./pages/public/SupportPage";
import DemoPage from "./pages/public/DemoPage";
 import ResetPasswordPage from "./pages/auth/ResetPasswordPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Marketing Landing Page */}
        <Route path="/" element={<PublicLandingPage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/get-tags" element={<GetTagsPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/demo" element={<DemoPage />} />

        {/* Admin */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          element={
            <RequireAuth>
              {" "}
              <AdminLayout />{" "}
            </RequireAuth>
          }
        >
          <Route path="/admin/qr-generate" element={<QrGeneratePage />} />
          <Route path="/admin/qr-list" element={<QrListPage />} />
        </Route>

        {/* Finder */}
        <Route path="/t/:qrId" element={<FinderScanPage />} />


       
      {/* Auth */}
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

