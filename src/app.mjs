import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to parse URL-encoded data from the form
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle form submission
app.post('/submit', (req, res) => {
    const { first_name, last_name, other_name, email, phone_number, gender } = req.body;
    const newData = { first_name, last_name, other_name, email, phone_number, gender };

    // Read the existing data from the file
    fs.readFile('database.json', 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).send('An error occurred while reading the file.');
        }

        const jsonData = data ? JSON.parse(data) : [];
        jsonData.push(newData);

        // Write the new data back to the file
        fs.writeFile('database.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).send('An error occurred while writing to the file.');
            }
            res.send('Data successfully saved!');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
