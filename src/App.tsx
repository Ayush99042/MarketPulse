import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Listing } from './Page/Listing';
import { Detail } from './Page/Detail';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Listing />} />
        <Route path="/detail/:symbol" element={<Detail />} />
      </Routes>
    </Layout>
  );
}

export default App;
