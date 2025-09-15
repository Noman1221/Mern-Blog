
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/Context';

function AuthPages() {
    const { register, login } = useContext(AppContext);
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            let res;
            if (isLogin) {
                res = await login({ email: form.email, password: form.password });
            } else {
                res = await register(form);
            }
            if (res && res.token) {
                navigate('/');
            } else {
                setError(res?.message || 'Authentication failed');
            }
        } catch {
            setError('Something went wrong');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
            <h2 style={{ textAlign: 'center' }}>{isLogin ? 'Login' : 'Register'}</h2>
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <div style={{ marginBottom: 12 }}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: 8 }}
                        />
                    </div>
                )}
                <div style={{ marginBottom: 12 }}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: 8 }}
                    />
                </div>
                <div style={{ marginBottom: 12 }}>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: 8 }}
                    />
                </div>
                {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
                <button type="submit" style={{ width: '100%', padding: 10, background: '#007bff', color: '#fff', border: 'none', borderRadius: 4 }}>
                    {isLogin ? 'Login' : 'Register'}
                </button>
            </form>
            <div style={{ marginTop: 16, textAlign: 'center' }}>
                {isLogin ? (
                    <span>Don't have an account? <button style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setIsLogin(false)}>Register</button></span>
                ) : (
                    <span>Already have an account? <button style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setIsLogin(true)}>Login</button></span>
                )}
            </div>
        </div>
    );
}

export default AuthPages;