const AsyncHandler = require("../utils/asyncHandler")
const userSchema = require("../models/userSchema")
const { generateAccToken } = require("../services/tokens")
const resHandler = require("../utils/resHandler")
const AppError = require("../utils/AppError")

// ========================== Sign Up ===========================
const signup = AsyncHandler(async (req, res) => {
    const { email, password } = req.body

    // ---------- Existing User 
    if (!email) return res.status(400).send({ message: 'Email is required!' })
    if (!password) return res.status(400).send({ message: 'Password is required!' })

    // ----------- Sent to DB 
    await userSchema.create({
        email,
        password,
    })

    // ------------------ Success
    resHandler.success(res, 201, "Registration successful");
});

// ========================== Sign In =============================
const signin = AsyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email) return res.status(400).send({ message: 'Email is required!' })
    if (!password) return res.status(400).send({ message: 'Password is required!' })

    // ---------- Existing User 
    const existingUser = await userSchema.findOne({ email })
    if (!existingUser) return res.status(404).send({ message: `User with this email doesn't exists. Please signUp!` })

    // --------- Compare password 
    if (!(await existingUser.comparePassword(password))) {
        return res.status(400).send({ message: 'Wrong credentials' })
    }

    // ------------- JWT token and cookie
    const accToken = generateAccToken(existingUser)
    res.cookie("X-AS-TOKEN", accToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 120 * 24 * 60 * 60 * 1000
    })

    // ------------ Success 
    res.status(200).send({
        message: "Login Successfully completed!",
        data: {
            _id: existingUser._id,
            email: existingUser.email,
            role: existingUser.role,
        }
    })
});

// ========================== Logout =============================
const logout = AsyncHandler(async (req, res) => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.clearCookie("X-AS-TOKEN", cookieOptions);
    res.clearCookie("X-RF-TOKEN", cookieOptions);

    resHandler.success(res, 200, "Logout successful");
});

// ========================== Authenticate me =================
const profile = AsyncHandler(async (req, res) => {
    const user = req.user;

    // if no user 
    if (!user?._id) return resHandler.success(res, 200, "", {
        authenticated: false,
        user: null,
    });

    const currentUser = await userSchema.findById(user._id).select("username fullname email role");

    if (!currentUser) return resHandler.success(res, 200, "", {
        authenticated: false,
        user: null,
    });

    // success 
    resHandler.success(res, 200, "", {
        authenticated: true,
        user: {
            _id: currentUser._id,
            username: currentUser.username,
            fullname: currentUser.fullname,
            email: currentUser.email,
            role: currentUser.role,
        },
    });
});


module.exports = { signup, signin, logout, profile }