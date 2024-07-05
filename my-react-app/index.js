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
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.sendStatus(401);
    }
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
    });
    next();
};

app.post('/register', async (req, res) => {
    const { email, password } = req.body; // Extract email and password from the request body
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
);

app.get('/api/users', authToken, async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming you store user ID in the JWT payload

        const user = await prisma.user.findUnique({
            where: {
                id: userId // Assuming userId is stored in the req.user object
            },
            select: {
                email: true
            }
        });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Send the user's email in the response
        res.send({ email: user.email });

    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Server error' });
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body; // Extract email and password from the request body
    const user = await prisma.user.findUnique({ where: { email } }); // Find the user by email

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid email or password' }); // Send error response if email or password is incorrect
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, email: user.email });
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