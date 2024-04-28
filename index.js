const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const app = express();

const scrapeData = async () => {
    try {
        const response = await axios.get('https://kursdollar.org/');
        const $ = cheerio.load(response.data);
        const result = {};

        const table = $('.in_table');
        const row = table.find('tr').eq(3);
        const tdValues = row.find('td').map((index, element) => {
            return $(element).text().trim();
        }).get();

        return tdValues;
    } catch (error) {
        throw new Error('Gagal melakukan scraping data');
    }
};

app.get('/', async (req, res) => {
    try {
        const data = await scrapeData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
