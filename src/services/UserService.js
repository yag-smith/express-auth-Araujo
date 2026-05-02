import userRepository from '../repositories/UserRepository.js';

function formatUser(user) {
    const today = new Date();
    const birth = user.birthdate ? new Date(user.birthdate) : null;
    let age = null;
    if (birth) {
        age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    }
    return {
        id:          user._id,
        email:       user.email,
        name:        user.name,
        lastName:    user.lastName,
        phoneNumber: user.phoneNumber,
        birthdate:   user.birthdate,
        age,
        url_profile: user.url_profile,
        adress:      user.adress,
        roles:       user.roles.map(r => r.name),
        createdAt:   user.createdAt
    };
}

class UserService {
    async getAll() {
        const users = await userRepository.getAll();
        return users.map(formatUser);
    }

    async getById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }
        return formatUser(user);
    }

    async updateProfile(id, data) {
        const allowed = ['name', 'lastName', 'phoneNumber', 'birthdate', 'adress', 'url_profile'];
        const update  = Object.fromEntries(Object.entries(data).filter(([k]) => allowed.includes(k)));
        const user    = await userRepository.updateProfile(id, update);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }
        return formatUser(user);
    }
}

export default new UserService();
