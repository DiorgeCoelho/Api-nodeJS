const mongose = require('../../database');
const bcrypt = require('bcryptjs');


const UserSchema = new mongose.Schema({

    name: {
        type: String,
        require: true,

    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    passwordResetToken: {
        type: String,
        select: false,
    },
    passwordResetExpires: {
        type: Date,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

});


UserSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});
const User = mongose.model('User', UserSchema);

module.exports = User;