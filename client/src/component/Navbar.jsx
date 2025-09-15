import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppContext from '../context/Context';

function Navbar() {
    const { state, logout } = useContext(AppContext);

    const navigate = useNavigate();
    const isAuth = state && state



    const handleAuth = () => {
        if (isAuth) {
            logout();
            navigate('/auth');
        } else {
            navigate('/auth');
        }
    };

    return (
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 32px', background: '#222', color: '#fff' }}>
            <div style={{ fontWeight: 'bold', fontSize: 22 }}>
                <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>BlogPro</Link>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <button
                    onClick={() => navigate('/create')}
                    style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}
                >
                    Create Blog
                </button>
                <button onClick={handleAuth} style={{ background: isAuth ? '#dc3545' : '#007bff', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}>
                    {isAuth ? 'Logout' : 'Login / Signin'}
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
