const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();
const prisma = new PrismaClient();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    console.log('Authentication failed: No token provided');
    return res.status(401).send('Access Denied');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(403).send('Invalid Token');
    }
    req.user = user;
    next();
  });
};

// Routes for user signup and login
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log(`Login attempt failed: User not found for email ${email}`);
      return res.status(400).json({ error: 'User not found' });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      console.log(`Login attempt failed: Invalid password for email ${email}`);
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log(`Login successful for user ${email}. Token generated.`);
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Event routes
app.post('/events', authenticateToken, async (req, res) => {
  const { title, description, startTime, endTime } = req.body;
  const event = await prisma.event.create({
    data: {
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      userId: req.user.id // Assuming you have the user's ID from the authentication middleware
    }
  });
  res.status(201).json(event);
});

app.get('/events', authenticateToken, async (req, res) => {
  const events = await prisma.event.findMany({
    where: { userId: req.user.id },
  });
  res.json(events);
});

// Update event
app.put('/events/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, startTime, endTime } = req.body;
  try {
    const event = await prisma.event.update({
      where: { id: parseInt(id), userId: req.user.id },
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });
    res.json(event);
  } catch (error) {
    res.status(404).json({ error: 'Event not found or unauthorized' });
  }
});

// Delete event
app.delete('/events/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.event.delete({
      where: { id: parseInt(id), userId: req.user.id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Event not found or unauthorized' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
