const fs = require('fs');
const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.get('/users', (req, res, next) => {
    let body = '';
    fs.readFile('./db.json', 'utf-8', function (err, data) {
        body = data;
        res.end(body);
        res.end("GET Request Success")
        console.log("GET 요청이 수행됨");
    })

});

app.post('/login', (req, res) => {
    console.log("Request Success");
    console.log(req.body);  //body 내용을 콘솔에 출력

    fs.readFile('./db.json', 'utf8',
        (error, jsonFile) => {
        if (error) return console.log(error);

        const jsonData = JSON.parse(jsonFile);
        console.log(jsonData);

        const users = jsonData.users;
        const {name, password} = req.body;

        for (let idx = 0; idx < users.length; idx++) {
            const user = users[idx];
            if (user.name === name) {
                if (user.password === password) {
                    return res.status(200).send("login success");
                }
            }
        }
        res.status(404).send("login failed");
    });
});

app.listen(3000, () => {
    console.log("Port : 3000..");
});