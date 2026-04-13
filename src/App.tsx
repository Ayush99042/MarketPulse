import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./Page/Dashboard";
import { Detail } from "./Page/Detail";
import { Listing } from "./Page/Listing";
import { Watchlist } from "./Page/Watchlist";
import { Support } from "./Page/Support";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/stocks" element={<Listing />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/detail/:symbol" element={<Detail />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </Layout>
  );
}

export default App;
