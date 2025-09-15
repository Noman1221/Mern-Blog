import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppContext from '../context/Context';

function BlogDetails() {
    const { id } = useParams();
    const { state, getBlogById, updateBlog, deleteBlog, addComment, getComments, deleteComment, updateComment } = useContext(AppContext);
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({ title: '', content: '' });
    const [commentForm, setCommentForm] = useState({ text: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const isAuth = state && state.token;
    const userId = state && state._id;
    const navigate = useNavigate();

    const fetchBlog = async () => {
        setLoading(true);
        const res = await getBlogById(id);
        setBlog(res);
        setForm({ title: res?.title || '', content: res?.content || '' });
        setLoading(false);
    };
    const fetchComments = async () => {
        const res = await getComments(id);
        setComments(res || []);
    };
    useEffect(() => {
        fetchBlog();
        fetchComments();
        // eslint-disable-next-line
    }, [id]);

    const handleEdit = () => setEditMode(true);
    const handleCancel = () => {
        setEditMode(false);
        setForm({ title: blog.title, content: blog.content });
    };
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        const res = await updateBlog(id, form);
        if (res && res._id) {
            setEditMode(false);
            fetchBlog();
        } else {
            setError(res?.message || 'Update failed');
        }
    };
    const handleDelete = async () => {
        if (window.confirm('Delete this blog?')) {
            await deleteBlog(id);
            navigate('/');
        }
    };
    const handleCommentChange = (e) => setCommentForm({ text: e.target.value });
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentForm.text.trim()) return;
        await addComment(id, { text: commentForm.text });
        setCommentForm({ text: '' });
        fetchComments();
    };
    const handleDeleteComment = async (cid) => {
        await deleteComment(id, cid);
        fetchComments();
    };
    const handleUpdateComment = async (cid, text) => {
        await updateComment(id, cid, { text });
        fetchComments();
    };

    if (loading) return <div style={{ maxWidth: 700, margin: '32px auto' }}>Loading...</div>;
    if (!blog) return <div style={{ maxWidth: 700, margin: '32px auto' }}>Blog not found.</div>;

    return (
        <div style={{ maxWidth: 700, margin: '32px auto' }}>
            {editMode ? (
                <form onSubmit={handleUpdate} style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px #eee', marginBottom: 24 }}>
                    <h3>Edit Blog</h3>
                    <div style={{ marginBottom: 12 }}>
                        <input type="text" name="title" value={form.title} onChange={handleChange} required style={{ width: '100%', padding: 8 }} />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <textarea name="content" value={form.content} onChange={handleChange} required rows={5} style={{ width: '100%', padding: 8 }} />
                    </div>
                    {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
                    <button type="submit" style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer', marginRight: 8 }}>Update</button>
                    <button type="button" onClick={handleCancel} style={{ background: '#888', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}>Cancel</button>
                </form>
            ) : (
                <div style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px #eee', marginBottom: 24 }}>
                    <h2>{blog.title}</h2>
                    <div style={{ color: '#555', fontSize: 16, margin: '12px 0' }}>{blog.content}</div>
                    <div style={{ fontSize: 13, color: '#888' }}>By {blog.author?.username || 'Unknown'}</div>
                    {isAuth && userId === blog.author?._id && (
                        <div style={{ marginTop: 16 }}>
                            <button onClick={handleEdit} style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer', marginRight: 8 }}>Edit</button>
                            <button onClick={handleDelete} style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}>Delete</button>
                        </div>
                    )}
                </div>
            )}
            <div style={{ background: '#fafafa', padding: 16, borderRadius: 8, boxShadow: '0 1px 4px #eee' }}>
                <h4>Comments</h4>
                {isAuth && (
                    <form onSubmit={handleAddComment} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                        <input type="text" value={commentForm.text} onChange={handleCommentChange} placeholder="Add a comment..." style={{ flex: 1, padding: 8 }} />
                        <button type="submit" style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}>Add</button>
                    </form>
                )}
                {comments.length === 0 ? (
                    <div>No comments yet.</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {comments.map(c => (
                            <CommentItem key={c._id} comment={c} userId={userId} isAuth={isAuth} onDelete={handleDeleteComment} onUpdate={handleUpdateComment} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function CommentItem({ comment, userId, isAuth, onDelete, onUpdate }) {
    const [edit, setEdit] = useState(false);
    const [text, setText] = useState(comment.text);
    return (
        <div style={{ background: '#fff', borderRadius: 6, padding: 10, boxShadow: '0 1px 2px #eee' }}>
            {edit ? (
                <form onSubmit={e => { e.preventDefault(); onUpdate(comment._id, text); setEdit(false); }} style={{ display: 'flex', gap: 8 }}>
                    <input value={text} onChange={e => setText(e.target.value)} style={{ flex: 1, padding: 6 }} />
                    <button type="submit" style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>Save</button>
                    <button type="button" onClick={() => setEdit(false)} style={{ background: '#888', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>Cancel</button>
                </form>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                        <b>{comment.author?.username || 'User'}:</b> {comment.text}
                    </div>
                    {isAuth && userId === comment.author?._id && (
                        <>
                            <button onClick={() => setEdit(true)} style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', marginRight: 4 }}>Edit</button>
                            <button onClick={() => onDelete(comment._id)} style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>Delete</button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default BlogDetails;
