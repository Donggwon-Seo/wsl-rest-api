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
        //res.end("GET Request Success");
        console.log("GET 요청이 수행됨");
    })
});

app.post('/inquire', (req, res) => {
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

                        const person = {
                            id: userId,
                            name: userName,
                            blogName: userBlogName
                        }

                        /* res.end("ID:" + userId + "\n" + "Name:" + userName + "\n" +
                            "BlogName:" + userBlogName); */

                        res.end(JSON.stringify(person));
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
                code = 404; // not page 200 : 요청은 성공하였으나 ~~ // 에러코드 확인
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

            //json 속성 핸들링 가능 // 변수 찾고 꺼내기

            if (isDuplicated) {
                res.status(code).send(message);
            } else {
                users.push(req.body);
                const newUsersData = {users};
                fs.writeFile('./db.json', JSON.stringify(newUsersData, null, 4),
                    "utf8", (err) => {

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

            // json 에서 인덱스로 빼는 방법
            // splice 말고 새로운 방법 찾기
            // 객체의 속성만 바꾸는 방법도 찾아보기, add 나 delete 라는 메소드로 가능

            for (let idx = 0; idx < users.length; idx++) {
                const user = users[idx];
                if (user.id === id) {
                    if (user.password === password) {  // user 만 찾고
                        users.splice(idx, 1); // 인덱스 users[idx] 문제 해결
                        isDuplicated = false;
                        const newUsersData = {users};
                        fs.writeFile('./db.json', JSON.stringify(newUsersData, null, 4),
                            "utf8", (err) => {
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
            } else {
                res.end("Delete Success !");
            }
        });
});

app.listen(3000, () => {
    console.log("Port : 3000..");
});