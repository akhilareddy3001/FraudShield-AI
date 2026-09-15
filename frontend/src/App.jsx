import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AnalyzeTransaction from "./pages/AnalyzeTransaction";
import UploadTransactions from "./pages/UploadTransactions";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analyze" element={<AnalyzeTransaction />} />
        <Route path="/upload" element={<UploadTransactions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;