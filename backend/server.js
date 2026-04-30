const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Servir archivos estáticos (CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, '..')));

// 2. Ruta para guardar reseñas
app.post('/api/reviews', (req, res) => {
    const nuevaReseña = req.body;
    const filePath = path.join(__dirname, 'reseñas.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        let reseñas = [];
        if (!err && data && data.trim().length > 0) {
            try {
                reseñas = JSON.parse(data);
            } catch (e) {
                reseñas = [];
            }
        }
        
        reseñas.push({
            sabor: nuevaReseña.sabor,
            texto: nuevaReseña.texto,
            fecha: new Date().toLocaleString()
        });

        fs.writeFile(filePath, JSON.stringify(reseñas, null, 2), (err) => {
            if (err) return res.status(500).send("Error interno");
            res.send("Reseña guardada");
        });
    });
});

// 3. ¡ESTA ES LA CLAVE! Ruta principal para cargar la carta
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Index.html'));
});

// 4. Si intentan entrar a cualquier otra cosa, también mandarlos al Index
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto ${PORT}`);
});