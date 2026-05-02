import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import seedRoles from './utils/seedRoles.js';
import seedUsers from './utils/seedUsers.js';
import webRoutes from './routes/web.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

app.use('/', webRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ message: err.message });
});

app.use((req, res) => {
    res.status(404).render('404');
});

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Conectado a MongoDB');
        await seedRoles();
        await seedUsers();
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Servidor corriendo en el puerto ${process.env.PORT || 3000}`);
        });
    })
    .catch(err => {
        console.error('Error al conectar con Mongo:', err);
        process.exit(1);
    });
