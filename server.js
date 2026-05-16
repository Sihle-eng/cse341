const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB, getContactsCollection } = require('./db');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TEST ROUTE - Check if express is working
app.get('/test', (req, res) => {
    res.json({ message: 'Express is working!' });
});

// Swagger setup
let swaggerUi, swaggerSpecs;
try {
    swaggerUi = require('swagger-ui-express');
    const swaggerJsdoc = require('swagger-jsdoc');
    
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Contacts API',
                version: '1.0.0',
            },
            servers: [
                {
                    url: `http://localhost:${PORT}`,
                },
            ],
        },
        apis: ['./routes/*.js'],
    };
    
    swaggerSpecs = swaggerJsdoc(options);
    console.log('Swagger specs created');
    
    // Mount Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
    console.log('Swagger UI mounted at /api-docs');
    
    app.get('/api-docs', (req, res) => {
        res.redirect('/api-docs/');
    });
    
} catch (error) {
    console.error('Swagger error:', error.message);
}


// Professional endpoint
app.get('/professional', async (req, res) => {
    try {
        const collection = getContactsCollection();
        const contacts = await collection.find({}).toArray();
        if (contacts.length === 0) {
            return res.status(404).json({ error: 'No contacts found' });
        }
        const mainContact = contacts[0];
        res.json({
            professionalName: `${mainContact.firstName} ${mainContact.lastName}`,
            base64Image: "",
            nameLink: {
                firstName: mainContact.firstName,
                url: `mailto:${mainContact.email}`
            },
            primaryDescription: `Favorite Color: ${mainContact.favoriteColor}`,
            workDescription1: `Birthday: ${mainContact.birthday}`,
            workDescription2: `Email: ${mainContact.email}`,
            linkTitleText: "Connect with me",
            linkedInLink: { text: "LinkedIn", link: "#" },
            githubLink: { text: "GitHub", link: "#" }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.json({
        message: 'API is running!',
        endpoints: {
            test: 'GET /test',
            docs: 'GET /api-docs',
            contacts: 'GET /contacts'
        }
    });
});

// Contacts routes
const contactsRoutes = require('./routes/contacts');
app.use('/contacts', contactsRoutes);

// Start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server on http://localhost:${PORT}`);
        console.log(`Test: http://localhost:${PORT}/test`);
        console.log(` Docs: http://localhost:${PORT}/api-docs`);
        console.log(` Contacts: http://localhost:${PORT}/contacts`);
    });
}).catch(err => {
    console.error('Failed to start:', err.message);
});