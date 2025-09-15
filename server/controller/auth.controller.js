import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/auth.model.js";

export const register = async (req, res) => {
    let { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: "missing details" })
    let user = await User.findOne({ email })
    if (user) {
        return res.status(409).json({ message: "user already exist" })
    }
    const passwordHash = await bcrypt.hash(password, 10);
    if (!passwordHash) {
        return res.status(500).json({ message: "" })
    }
    const newUser = new User({
        username, email,
        password: passwordHash,
    });
    await newUser.save();
    let token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: "2h" });

    res.status(201).json({ message: "user created", user: newUser, token })
}
export const login = async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "missing details" })
    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "user not found" })
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "invalid credentials" })
    let token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "2h" });
    res.status(200).json({ message: "login successful", user, token })
}
export const isAuthUser = async (req, res) => {
    let userId = req.user.id;
    try {
        let user = await User.findById(userId).select("-password");
        if (!user) return res.status(404).json({ message: "user not found" })
        let token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "2h" });

        res.status(200).json({ user, token: token })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};