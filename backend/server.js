const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sirve los archivos estáticos (HTML, CSS, JS del front)
app.use(express.static(path.join(__dirname, '../')));

// Ruta para las reseñas
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
            console.log("¡Reseña guardada con éxito!");
            res.send("Reseña guardada");
        });
    });
});

// PUERTO DINÁMICO: Esto es obligatorio para que funcione en GitHub/Render/Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto ${PORT}`);
});