import { createContext, useEffect, useState } from "react";

const AppContext = createContext(null);
const baseURL = "http://localhost:4000";
export const AppProvider = ({ children }) => {
    const [state, setState] = useState({});
    // console.log("idhar", state);

    useEffect(() => {
        let token = localStorage.getItem("token");
        if (!token) return;
        const fetchUserData = async () => {
            try {
                let res = await fetch(`${baseURL}/api/auth/me`, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                let data = await res.json();
                setState(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchUserData();
    }, []);
    const register = async (userData) => {

        try {
            let res = await fetch(`${baseURL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });
            let data = await res.json();
            localStorage.setItem("token", data.token);
            setState(data.token);
            return data;
        } catch (error) {
            console.log(error);
        }
    };
    const login = async (userData) => {
        try {
            let res = await fetch(`${baseURL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });
            let data = await res.json();
            localStorage.setItem("token", data.token);
            setState(data.token);
            return data;
        } catch (error) {
            console.log(error);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setState("initialState");
    };

    const createBlog = async (blogData) => {
        let token = localStorage.getItem("token");
        if (!token) return;
        try {
            let res = await fetch(`${baseURL}/api/blog`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(blogData)
            });
            let data = await res.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    };
    const getAllBlogs = async () => {
        let token = localStorage.getItem("token");
        try {
            let headers = { "Content-Type": "application/json" };
            if (token) headers["Authorization"] = `Bearer ${token}`;
            let res = await fetch(`${baseURL}/api/blog`, {
                method: "GET",
                headers
            });
            let data = await res.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    };
    const getBlogById = async (id) => {
        let token = localStorage.getItem("token");
        if (!token) return;
        try {
            let res = await fetch(`${baseURL}/api/blog/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            let data = await res.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    };

    const updateBlog = async (id, blogData) => {
        let token = localStorage.getItem("token");
        if (!token) return;
        try {
            let res = await fetch(`${baseURL}/api/blog/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(blogData)
            });
            let data = await res.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    };
    const deleteBlog = async (id) => {
        let token = localStorage.getItem("token");
        if (!token) return;
        try {
            let res = await fetch(`${baseURL}/api/blog/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            let data = await res.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    };
    const addComment = async (id, commentData) => {
        let token = localStorage.getItem("token");
        if (!token) return;
        try {
            let res = await fetch(`${baseURL}/api/blog/${id}/comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(commentData)
            });
            let data = await res.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    };
    const deleteComment = async (id, commentId) => {
        let token = localStorage.getItem("token");
        if (!token) return;
        try {
            let res = await fetch(`${baseURL}/api/blog/${id}/comment/${commentId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            let data = await res.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    };
    const updateComment = async (id, commentId, commentData) => {
        let token = localStorage.getItem("token");
        if (!token) return;
        try {
            let res = await fetch(`${baseURL}/api/blog/${id}/comment/${commentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(commentData)
            });
            let data = await res.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    };
    const getComments = async (id) => {
        let token = localStorage.getItem("token");
        if (!token) return;
        try {
            let res = await fetch(`${baseURL}/api/blog/${id}/comments`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            let data = await res.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <AppContext.Provider value={{ state, setState, register, login, logout, createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog, addComment, deleteComment, updateComment, getComments }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
