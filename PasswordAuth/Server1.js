// // Login

// const express = require('express')
// const app = express()
// const bcrypt = require('bcrypt');

// app.use(express.json());
// const users = []

// app.get('/users', (req, res) => {
//     res.json(users)
// });

// app.post('/users', async (req, res) => {
//     try {
//         //const salt = await bcrypt.genSalt()
//         const hashedPassword = await bcrypt.hash(req.body.password, 10)
//         const user = { name: req.body.name, password: hashedPassword }
//         users.push(user)
//         res.status(201).send()
//     } catch {
//         res.status(500).send()
//     }

// });

// app.post('/users/login', async(req, res) => {
//     const user = users.find(user => user.name === req.body.name)
//     if(user == null) {
//         return res.status(404).send('Cannot find user')
//     }
//     try {
//         if (await bcrypt.compare(req.body.password, user.password)){
//             res.send('success')
//         } else {
//             res.send('error')
//         }
//     } catch(e) {
//         res.status(500).send('Cannot compare password')
//     }
// });




// app.listen(3000)


///////////////////////////////////////////////////////////////////////////////////

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Added urlencoded middleware
const users = [];

app.get('/users', (req, res) => {
    res.json(users);
});
app.post('/users', async (req, res) => {
    try {
        console.log("Received user registration request:", req.body);
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = { name: req.body.name, password: hashedPassword };
        users.push(user);
        console.log("User registered:", user);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Error in user registration:", error);
        res.status(500).json({ message: 'An error occurred during registration' });
    }
});


// app.post('/users', async (req, res) => {
//     try {
//         const hashedPassword = await bcrypt.hash(req.body.password, 10);
//         const user = { name: req.body.name, password: hashedPassword };
//         users.push(user);
//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//         console.error("Error in user registration:", error);
//         res.status(500).json({ message: 'An error occurred during registration' });
//     }
// });

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    try {
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (passwordMatch) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Incorrect password' });
        }
    } catch (error) {
        console.error("Error comparing password:", error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
});

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

