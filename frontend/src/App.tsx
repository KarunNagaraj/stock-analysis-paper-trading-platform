import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import StockSearch from "./features/stocks/StockSearch";
import StockDetails from "./features/stocks/StockDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/stocks" element={<StockSearch />} />
        <Route path="/stocks/:symbol" element={<StockDetails />} />

        <Route
          path="*"
          element={<Navigate to="/stocks" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;