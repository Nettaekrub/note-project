import express from 'express'; // req res 
import cors from 'cors'; //http req
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const port = 8000;
const prisma = new PrismaClient();
const SECRET_KEY = '886725';

app.use(express.json());
app.use(cors());

// Middleware to authenticate token
const authToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.sendStatus(401);
    } 
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        } 
        req.user = user; // Attach the user information to the request object
    });
};

app.post('/register', async (req, res) => {
    const { email, password } = req.body; // Extract email and password from the request body
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt rounds of 10
    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        }); 
        res.status(201).json({ message: 'User created successfully' }); // Send success response
    } catch (error) {
        res.status(400).json({ message: 'User already exists' }); // Send error response if user already exists
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body; // Extract email and password from the request body
    const user = await prisma.user.findUnique({ where: { email } }); // Find the user by email

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid email or password' }); // Send error response if email or password is incorrect
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});


app.get('/api/notes', async (req, res) => {
    try {
        const notes = await prisma.note.findMany();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

app.get('/api/notes/:id', async (req, res) => {
    try {
        const notes = await prisma.note.findFirst();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

app.delete('/api/notes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.note.delete({
            where: {
                id: id, 
            },
        });
        res.status(204).send(); // Send 204 No Content if successful
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/notes/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const updatedNote = await prisma.note.update({
            where: { id: id },
            data: { title, content }
        });
        res.json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/notes', async (req, res) => {
    const { title, content } = req.body;
    try {
        const newNote = await prisma.note.create({
            data: {
                title,
                content
            }
        });
        res.status(201).json(newNote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});