const fs = require('fs');
const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.get('/users', (req, res, next) => {
    fs.readFile('./db.json', 'utf8',
        (error, jsonFile) => {
            if (error) return console.log(error);

            const jsonData = JSON.parse(jsonFile);

            const users = jsonData.users;
            const {id, password} = req.body;

            let code = 200;
            let message = "";
            let isDuplicated = false;

            for (let idx = 0; idx < users.length; idx++) {
                const user = users[idx];
                const userData = JSON.stringify(user);
                if (user.id === id) {
                    if (user.password === password) {
                        let userId = JSON.parse(userData).id;
                        let userName = JSON.parse(userData).name;
                        let userBlogName = JSON.parse(userData).blogName;
                        console.log(userId, userName, userBlogName);
                        res.end("ID:" + userId + "\n" + "Name:" + userName + "\n" +
                            "BlogName:" + userBlogName);
                        isDuplicated = false;
                        break;
                    }
                }
                isDuplicated = true;
                code = 404;
                message = "ID or Password do not match\n";
            }

            if (isDuplicated) {
                res.status(code).send(message);
            }

        });

});

app.post('/login', (req, res) => {
    console.log("Request Success");
    console.log(req.body);  //body 내용을 콘솔에 출력

    fs.readFile('./db.json', 'utf8',
        (error, jsonFile) => {
            if (error) return console.log(error);

            const jsonData = JSON.parse(jsonFile);

            let code = 200;
            let message = "";

            const users = jsonData.users;
            const {id, password} = req.body;
            let isDuplicated = false;

            for (let idx = 0; idx < users.length; idx++) {
                const user = users[idx];
                if (user.id === id) {
                    if (user.password === password) {
                        isDuplicated = false;
                        code = 200;
                        message = "Login Success";
                        res.status(code).send(message);
                        break;
                    }
                }
                isDuplicated = true;
                code = 404;
                message = "Login failed";
            }
            if (isDuplicated) {
                res.status(code).send(message);
            }
        });
});

app.post('/signup', (req, res) => {
    console.log("Request Success");

    let code = 200;
    let message = "";
    fs.readFile('./db.json', 'utf8',
        (error, jsonFile) => {
            if (error) return console.log(error);

            const jsonData = JSON.parse(jsonFile);
            console.log(jsonData); // 현재 db.json 파일 정보

            const users = jsonData.users;
            const {separator, id, name, password, blogName} = req.body;


            let isDuplicated = false;

            for (let idx = 0; idx < users.length; idx++) {
                const user = users[idx];
                if (user.id === id) {
                    isDuplicated = true;
                    code = 404;
                    message = "Duplicate ID.\n";
                    break;
                } else if (user.name === name) {
                    isDuplicated = true;
                    code = 404;
                    message = "Duplicate Name.\n"
                    break;
                } else if (user.separator === separator) {
                    isDuplicated = true;
                    code = 404;
                    message = "Duplicate Separator Number.\n"
                    break;
                }
            }

            if (isDuplicated) {
                res.status(code).send(message);
            } else {
                users.push(req.body);
                const newUsersData = {users};
                fs.writeFile('./db.json', JSON.stringify(newUsersData), "utf8", (err) => {

                });
                res.end("SignUp Success !");
                console.log(newUsersData);
            }

        });
});

app.delete('/users', (req, res) => {
    console.log("Request Success");
    let code = 200;
    let message = "";
    fs.readFile('./db.json', 'utf8',
        (error, jsonFile) => {
            if (error) return console.log(error);

            const jsonData = JSON.parse(jsonFile);
            // console.log(jsonData); // 현재 db.json 파일 정보

            const users = jsonData.users;
            const {separator, id, name, password, blogName} = req.body;

            let isDuplicated = false;

            for (let idx = 0; idx < users.length; idx++) {
                const user = users[idx];
                if (user.id === id) {
                    if (user.password === password) {
                        users.splice((separator - 1), 1);
                        isDuplicated = false;
                        const newUsersData = {users};
                        fs.writeFile('./db.json', JSON.stringify(newUsersData), "utf8", (err) => {
                        });
                        break;
                    }
                }
                isDuplicated = true;
                code = 404;
                message = "ID or Password do not match\n"
            }
            if (isDuplicated) {
                res.status(code).send(message);
            }else{
                res.end("Delete Success !");
            }
        });
});

app.listen(3000, () => {
    console.log("Port : 3000..");
});