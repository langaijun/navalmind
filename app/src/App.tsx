import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import LandingPage from './pages/LandingPage';
import { AuthGuard } from './components/AuthGuard';

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* 首页 = 登录页 */}
        <Route path="/" element={<LoginPage />} />
        {/* 登录后才能进入对话 */}
        <Route
          path="/chat"
          element={
            <AuthGuard>
              <ChatPage />
            </AuthGuard>
          }
        />
        {/* 静态介绍页（关于Naval） */}
        <Route
          path="/about"
          element={
            <AuthGuard>
              <LandingPage />
            </AuthGuard>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
