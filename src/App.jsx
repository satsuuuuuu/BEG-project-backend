import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import InfoBox from './Components/InfoBox';
import TrendingGames from './Components/TrendingGames';
import InspirationBanner from './Components/InspirationBanner';
import AdminDashboard from './Pages/AdminDashboard';  
import PublicGamesPage from './Components/PublicGamesPage';

// This wrapper component allows us to use the useLocation hook
function Layout() {
  const location = useLocation();

  // The Navbar will only render if the path is NOT /admin
  const showNavbar = location.pathname !== '/admin';

  return (
    <div className="min-h-screen bg-[#F4F0EB]">
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <InfoBox />
            <TrendingGames />
            <InspirationBanner />
            <PublicGamesPage />
          </>
        } />

        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;