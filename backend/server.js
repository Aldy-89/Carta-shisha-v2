const express = require('express');
const fs = require('fs');
const path = require('path'); // <--- Añadimos esto
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(require('cors')());

// --- EL ARREGLO ESTÁ AQUÍ ---
// Servir los archivos que están fuera de la carpeta backend (Index.html, etc.)
app.use(express.static(path.join(__dirname, '..')));

// Cuando alguien entre a la raíz, enviarle el Index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Index.html'));
});
// ----------------------------

const reseñasFile = path.join(__dirname, 'reseñas.json');

app.get('/api/resenas', (req, res) => {
    if (!fs.existsSync(reseñasFile)) return res.json([]);
    const data = fs.readFileSync(reseñasFile);
    res.json(JSON.parse(data));
});

app.post('/api/resenas', (req, res) => {
    const nuevasReseñas = req.body;
    fs.writeFileSync(reseñasFile, JSON.stringify(nuevasReseñas, null, 2));
    res.json({ message: 'Reseña guardada' });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});