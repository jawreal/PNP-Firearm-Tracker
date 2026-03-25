import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuthProvider";
import PrivateRoutes from "./routes/PrivateRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/app/*" element={<PrivateRoutes />} />
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
