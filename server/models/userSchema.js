const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

// ════════════════════ Main Schema ════════════════════
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'user']
    }

})
// ════════════════════ password Hash ════════════════════
userSchema.pre("save", async function () {
    const user = this;
    if (!user.isModified("password")) {
        return;
    }

    try {
        user.password = await bcrypt.hash(user.password, 10);
    } catch (err) { }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model('user', userSchema)