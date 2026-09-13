import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/\S+@\S+\.\S+/, 'is invalid'],
            index: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 80,
        }
    },
    {
        timestamps: true,
    }
);
userSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 12);
}
userSchema.methods.comparePassword = function (pin) {
    return bcrypt.compare(pin, this.password);
}
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.__v;
    return obj;
}
export default mongoose.model('User', userSchema);