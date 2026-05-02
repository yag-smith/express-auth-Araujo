import mongoose from 'mongoose';

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$%&*@]).{8,}$/;

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: v => passwordRegex.test(v),
            message: 'La contraseña debe tener mínimo 8 caracteres, 1 mayúscula, 1 dígito y 1 caracter especial (# $ % & * @)'
        }
    },
    name: {
        type: String
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    url_profile: {
        type: String
    },
    adress: {
        type: String
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }]
}, { timestamps: true });

UserSchema.virtual('age').get(function () {
    const today = new Date();
    const birth = new Date(this.birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
});

export default mongoose.model('User', UserSchema);
