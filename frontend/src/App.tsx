import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import StockSearch from "./features/stocks/StockSearch";
import StockDetails from "./features/stocks/StockDetails";


//Link changes the url without reloading the page and browserRouter uses routes to render the component based on the url. Navigate is used to redirect the user to a different route.
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