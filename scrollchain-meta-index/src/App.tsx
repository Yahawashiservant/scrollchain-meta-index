import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import CodexCIDMap from "./pages/CodexCIDMap";
import CodexVault from "./pages/CodexVault";
import CodexCloudDashboard from "./pages/CodexCloudDashboard";
import CodexObservatory from "./pages/CodexObservatory";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/codex-cid-map" element={<MainLayout><CodexCIDMap /></MainLayout>} />
        <Route path="/codex-vault" element={<MainLayout><CodexVault /></MainLayout>} />
        <Route path="/codex-cloud-dashboard" element={<MainLayout><CodexCloudDashboard /></MainLayout>} />
        <Route path="/codex-observatory" element={<MainLayout><CodexObservatory /></MainLayout>} />
      </Routes>
    </Router>
  );
}
