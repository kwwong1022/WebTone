const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const fetch = require("cross-fetch");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 80;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));
app.use(cors({origin: '*',}));

// mongo connection
mongoose.connect('mongodb+srv://kwwong1022:f38k9494@cluster0.x7nst.mongodb.net/portfolio', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('mongoDB connection open');
})
.catch((err) => {
    console.log(err);
});

// routes
app.get('/', (req, res) => {
    res.render('app.ejs');
});


// HTML fetching
app.get('/api-test/html-fetching', async (req, res) => {
    const url = await req.query.url;
    console.log('url: ', url);

    await fetch(`${url}`)
        .then(res => {
            console.log('wait to parse', res);
            return res.text();
        })
        .then(data => {
            console.log('data parsed', data);
            res.send(data);
        })
        .catch(e => {
            console.log('error', e);
            res.send(e);
        })
})


app.get('*', (req, res) => {
    res.send('ERROR 404 not found.');
});

app.listen(PORT, () => {
    console.log(`app deployed on port ${PORT}`);
});