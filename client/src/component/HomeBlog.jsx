
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/Context';
import CreateBlog from './CreateBlog';

function HomeBlog() {
    const { state, getAllBlogs } = useContext(AppContext);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const isAuth = state && state.token;

    const fetchBlogs = async () => {
        setLoading(true);
        const res = await getAllBlogs();
        // If unauthorized or error, treat as empty array
        if (!Array.isArray(res)) {
            setBlogs([]);
        } else {
            setBlogs(res);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBlogs();
        // eslint-disable-next-line
    }, []);

    return (
        <div style={{ maxWidth: 700, margin: '32px auto' }}>
            {isAuth && <CreateBlog onCreated={fetchBlogs} />}
            <h2 style={{ marginBottom: 16 }}>All Blogs</h2>
            {loading ? (
                <div>Loading blogs...</div>
            ) : blogs.length === 0 ? (
                <div>No blogs found or you are not authorized to view blogs.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {blogs.map(blog => (
                        <div key={blog._id} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 16, cursor: 'pointer' }}
                            onClick={() => navigate(`/blog/${blog._id}`)}>
                            <h3 style={{ margin: 0 }}>{blog.title}</h3>
                            <div style={{ color: '#555', fontSize: 15, margin: '8px 0' }}>{blog.content?.slice(0, 120)}{blog.content?.length > 120 ? '...' : ''}</div>
                            <div style={{ fontSize: 13, color: '#888' }}>By {blog.author?.username || 'Unknown'}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default HomeBlog;