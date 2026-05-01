const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

// 1. Servir archivos estáticos
app.use(express.static(path.join(__dirname, '..')));

// 2. Ruta para guardar reseñas
app.post('/api/reviews', (req, res) => {
    const nuevaReview = req.body;
    const filePath = path.join(__dirname, 'reviews.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        let reviews = [];
        if (!err && data) {
            try {
                reviews = JSON.parse(data);
            } catch (e) { reviews = []; }
        }
        reviews.push(nuevaReview);
        fs.writeFile(filePath, JSON.stringify(reviews, null, 2), (err) => {
            if (err) return res.status(500).send("Error");
            res.send("Reseña guardada");
        });
    });
});

// 3. Ruta principal para cargar la web
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Index.html'));
});

// Ruta para que admin.html pueda leer las reseñas
app.get('/api/reviews', (req, res) => {
    const filePath = path.join(__dirname, 'reviews.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err || !data) return res.json([]); // Si hay error o no hay datos, manda una lista vacía
        try {
            res.json(JSON.parse(data));
        } catch (e) {
            res.json([]);
        }
    });
});

app.listen(port, () => {
    console.log("Servidor online");
});