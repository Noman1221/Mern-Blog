

import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { useContext } from 'react';
import BlogDetails from './component/BlogDetails';
import CreateBlog from './component/CreateBlog';
import HomeBlog from './component/HomeBlog';
import Navbar from './component/Navbar';
import AppContext from './context/Context';
import AuthPages from './pages/AuthPages';



function PrivateCreateBlog() {
  const { state } = useContext(AppContext);
  if (state && state.token) {
    return <div style={{ maxWidth: 700, margin: '32px auto' }}><CreateBlog /></div>;
  } else {
    return <Navigate to="/auth" />;
  }
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomeBlog />} />
        <Route path="/auth" element={<AuthPages />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/create" element={<PrivateCreateBlog />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}

export default App;