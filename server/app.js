const dbPool = require('./db');
const express =require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

appendWhere = (query) => {
    return query.includes('WHERE') ? ` AND` : ` WHERE`
}

app.get('/getships', async (req, res) => {
    try {
        console.log("Reuest query: ", req.query);
        var query =  `SELECT * FROM spaceData`;
        if(req.query.ship_type !== '') {
           query +=  appendWhere(query) + ` JSON_EXTRACT(spaceItem,'$.ship_type') = '${req.query.ship_type}'`
        }
        if(req.query.weight_kg !== '') {
            query += appendWhere(query) + ` JSON_EXTRACT(spaceItem,'$.weight_kg') = '${req.query.weight_kg}'`
        }
        if(req.query.home_port !== '') {
            query += appendWhere(query) + ` JSON_EXTRACT(spaceItem,'$.home_port') = '${req.query.home_port}'`
        }
        if(req.query.offset !== null) {
            query += ` LIMIT 5 OFFSET ${req.query.offset}`
        }
        console.log("SQL QUERY: ", query);
        const rows = await dbPool.query(query);
         if(rows.length <= 0) { // DB is empty, fetch from SpaceX's API
            var reqURL = 'https://api.spacexdata.com/v3/ships/' + '?limit=5&offset=' + req.query.offset + '&ship_type=' + req.query.ship_type +
            '&weight_kg=' + req.query.weight_kg + "&home_port=" + req.query.home_port;
            console.log("Request URL: ", reqURL);
            request(reqURL,
            async function (error, response, body) {
                if (!error && response.statusCode == 200) { // Ok status, add all items to DB
                    let shipList = JSON.parse(body);
                    for(var i = 0; i < shipList.length; i++) {
                        var spaceItem = {id: shipList[i].ship_id, spaceItem: JSON.stringify(shipList[i])}
                        await dbPool.query('INSERT IGNORE INTO spaceData SET ?', spaceItem);
                    }
                    res.status(200);
                    res.send({
                        result: body
                    });
                }
            })
        } else { // return rows from DB
            res.status(200);
            res.send({
                result: JSON.stringify(rows)
            });
        }
    } catch (e) {
        res.status(400);
        res.send({
            result: "Error fetching data :", e
        });
    }
});

app.get('/getshipcount', async (req, res) => {
    try {
        var query =  `SELECT COUNT(*) FROM spaceData`;
        const rows = await dbPool.query(query);
        res.status(200);
        res.send({
            result: JSON.stringify(rows)
        });
    } catch (e) {
        res.status(400);
        res.send({
            result: "Error fetching ship count :", e
        });
    }
});

app.listen('4000');
console.log(`Listening on port: 4000, wait for the development server to be up...`);