import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useDarkMode from "@/hooks/useDarkMode";
import { AuthProvider } from "@/hooks/useAuthProvider";
import PrivateRoutes from "./routes/PrivateRoutes";
import AuthRoutes from "./routes/AuthRoutes";

const App = () => {
  useDarkMode();
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/app/*" element={<PrivateRoutes />} />
          <Route path="/auth/*" element={<AuthRoutes />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
