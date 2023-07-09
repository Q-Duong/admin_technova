// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './components/pagination/Pagination.css';
// ----------------------------------------------------------------------

export default function App() {
  const navigate = useNavigate();
  const token = useSelector(state => state.token.value)

  useEffect(
    () => {
      if(!token){
        alert(`Bạn cần đăng nhập trước khi truy cập đây.`)
        navigate('/login')
      }
    },[token]
  )
  return (
    <ThemeProvider>
      <ScrollToTop />
      <StyledChart />
      <Router />
    </ThemeProvider>
  );
}
