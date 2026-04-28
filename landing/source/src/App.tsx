import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import { marketingNavigationItems } from './components/NavBar/constants';
import LandingPage from './landing-page/LandingPage';
import './Main.css';

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <NavBar navigationItems={marketingNavigationItems} />
      <div className='mx-auto max-w-screen-2xl'>
        <Routes>
          <Route path='/' element={<LandingPage />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;


