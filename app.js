const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;  

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/lokasi', async (req, res) => {
    const kota = req.query.kota || "Jakarta";

    const apiKey = "TmW3n2IbOKaZxkghOoYB"; 

    const url = `https://api.maptiler.com/geocoding/${kota}.json?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.features && data.features.length > 0) {
            const feature = data.features[0];
            const placeName = feature.place_name || "";
            const matchingText = feature.matching_text || feature.text || "";
            const placeType = (feature.place_type_name && feature.place_type_name[0]) || (feature.place_type && feature.place_type[0]) || "";
            const coordinates = feature.geometry.coordinates;

            res.json({
                place_name: placeName,
                matching_text: matchingText,
                tipe: placeType,
                koordinat: `${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}`
            });
        } else {
            res.status(404).json({ message: 'Lokasi tidak ditemukan' });
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Gagal mengambil data dari MapTiler' });
    }
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});