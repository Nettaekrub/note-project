import express from 'express'; // req res 
import cors from 'cors'; //http req
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import nodemailer from 'nodemailer'; // transport to email
// import crypto from 'crypto'; // random token

const app = express();
const port = 8000;
const prisma = new PrismaClient();
const SECRET_KEY = '886725';

{/* const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
    },
}); */}

app.use(express.json());
app.use(cors());

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
/// *** GOOGLE LOGIN PART ***////////
app.use(session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:8000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value.toLowerCase();
        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return done(null, existingUser);
        }
        const hashedPassword = await bcrypt.hash(profile.id, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        return done(null, user);

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
}));

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        const token = jwt.sign({ userId: req.user.id }, SECRET_KEY, { expiresIn: '1h' });
        res.redirect(`http://127.0.0.1:5173/?token=${token}`); // Redirect to your profile page or wherever you want
    }
    
);

///// ******* GOOGLE LOGIN ****** ////////

app.post('/register', async (req, res) => {
    let { email, password } = req.body; // Extract email and password from the request body
    email = email.toLowerCase()
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

{/* app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = crypto.randomBytes(32).toString('hex'); //generate random token
        const expires = new Date(Date.now() + 3600000); // Token expires in 1 hour

        await prisma.user.update({
            where: { email },
            data: { resetPasswordToken: token, resetPasswordExpires: expires },
        });

        const resetUrl = `http://localhost:8000/reset-password/${token}`;
        const mailOptions = {
            to: email,
            from: 'your-email@gmail.com',
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click this link to reset your password: ${resetUrl}`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: 'Password reset link sent' });
    } catch (error) {
        console.error('Error requesting password reset:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { gt: new Date() }, // Check if token is not expired
            },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: { email: user.email },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}); */}

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