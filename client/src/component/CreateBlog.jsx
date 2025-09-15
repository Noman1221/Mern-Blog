import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppContext from '../context/Context';


function CreateBlog({ onCreated }) {
    let { id } = useParams();
    const { createBlog } = useContext(AppContext);
    const [form, setForm] = useState({ title: '', description: '', image: '', id });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await createBlog(form);
            if (res && res._id) {
                setForm({ title: '', description: '', image: '' });
                if (onCreated) onCreated();
                navigate('/');
            } else {
                setError(res?.message || 'Failed to create blog');
            }
        } catch {
            setError('Something went wrong');
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px #eee', marginBottom: 24 }}>
            <h3>Create New Blog</h3>
            <div style={{ marginBottom: 12 }}>
                <input
                    type="text"
                    name="title"
                    placeholder="Blog Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: 8 }}
                />
            </div>
            <div style={{ marginBottom: 12 }}>
                <textarea
                    name="description"
                    placeholder="Blog Description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    style={{ width: '100%', padding: 8 }}
                />
            </div>
            <div style={{ marginBottom: 12 }}>
                <input
                    type="text"
                    name="image"
                    placeholder="Image URL"
                    value={form.image}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: 8 }}
                />
            </div>
            {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
            <button type="submit" disabled={loading} style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}>
                {loading ? 'Creating...' : 'Create Blog'}
            </button>
        </form>
    );
}

export default CreateBlog;
