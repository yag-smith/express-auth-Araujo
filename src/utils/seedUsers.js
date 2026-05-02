import bcrypt from 'bcrypt';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

export default async function seedUsers() {
    const existing = await userRepository.findByEmail('admin@admin.com');
    if (existing) return;

    const adminRole = await roleRepository.findByName('admin');
    if (!adminRole) {
        console.warn('Rol admin no encontrado, ejecuta seedRoles primero');
        return;
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashed = await bcrypt.hash('Admin123#', saltRounds);

    await userRepository.create({
        email: 'admin@admin.com',
        password: hashed,
        name: 'Admin',
        lastName: 'System',
        phoneNumber: '0000000000',
        birthdate: new Date('1990-01-01'),
        roles: [adminRole._id]
    });

    console.log('Seeded admin user: admin@admin.com / Admin123#');
}
