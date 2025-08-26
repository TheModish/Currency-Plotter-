const express = require("express");
const fs = require("fs");

const app = express();
const port = 3000;

// Function to parse number strings with comma as decimal separator
function parseNumber(str) {
    return parseFloat(str.replace(',', '.'));
}

// Serve static files
app.use(express.static('public'));

// Endpoint to handle requests for CSV data
app.get('/data', (req, res) => {
    // Read the CSV file
    fs.readFile('export.csv', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Split CSV data into lines
        const lines = data.trim().split('\n');

        // Parse each row and extract data into arrays
        const currencyData = {
            date: [],
            franc: [],
            euro: [],
            lira: [],
            forint: [],
            yen: [],
            dollar: []
        };

        for (let i = 0; i < lines.length; i++) {
            const columns = lines[i].trim().split(';');
            if (columns.length !== 7) {
                console.error(`Invalid number of columns at line ${i + 1}`);
                continue;
            }

            currencyData.date.push(columns[0]);
            currencyData.franc.push(parseNumber(columns[1]));
            currencyData.euro.push(parseNumber(columns[2]));
            currencyData.lira.push(parseNumber(columns[3]));
            currencyData.forint.push(parseNumber(columns[4]));
            currencyData.yen.push(parseNumber(columns[5]));
            currencyData.dollar.push(parseNumber(columns[6]));
        }

        // Send the currency data as JSON response
        res.json(currencyData);
    });
});

// Serve index2.html as the root URL ("/")
app.get('/', (req, res) => {
    // Read the contents of index2.html
    fs.readFile('public/index2.html', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Send the contents of index2.html as the response
        res.send(data);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
