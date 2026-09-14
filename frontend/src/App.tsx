import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import StockSearch from "./features/stocks/StockSearch";
import StockDetails from "./features/stocks/StockDetails";
import StockChart from "./features/stocks/StockChart";
import Screener from "./features/screener/Screener";
import Login from "./features/components/register-login/Login";
import Register from "./features/components/register-login/Register";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import Navbar from "./features/components/Navbar";
import PaperTradingAccount from "./features/paperTrading/PaperTradingAccount";

//Link changes the url without reloading the page and browserRouter uses routes to render the component based on the url. Navigate is used to redirect the user to a different route.
function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route element={<ProtectedRoute />}>
        <Route
            path="/stocks"
            element={<StockSearch />}
        />

        <Route
            path="/screener"
            element={<Screener />}
        />

        <Route
          path="/paper-trading"
          element={<PaperTradingAccount />}
        />

        <Route
            path="/stocks/:symbol/chart"
            element={<StockChart />}
        />

        <Route
            path="/stocks/:symbol"
            element={<StockDetails />}
        />
        </Route>

        <Route
            path="*"
            element={<Navigate to="/stocks" replace />} //replace tells React Router to replace the current browser history entry instead of adding a new one.
        />
    </Routes>
    </BrowserRouter>
  );
}

export default App;