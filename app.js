// References for express and pug
//Source: https://scriptverse.academy/tutorials/nodejs-express-pug.html
//Source: https://freshman.tech/learn-node/

const express = require('express')
const app = express()
var fs = require('fs');

app.set('view engine', 'pug')
app.set('views', './views')
app.use(express.static('css'));

var category = "work";

//Shows current todo lists on homepage
app.get('/', (req, res) => {
    
    if (req.query.category != undefined) {
        category = req.query.category;
    }
    let data = fs.readFileSync('todolist.txt');
    let lines = data.toString("utf8").split(/\r?\n/);
    var waiting = [];
    var started = [];
    var done = [];
    for (l in lines) {
        var value = lines[l].split('#');
        if (value[2] == 'waiting') {
            if (value[1] == category) {
                waiting.push({
                    'id': value[0],
                    'satus': value[2],
                    'todo': value[3]
                })
            }
        }
        else if (value[2] == 'started') {
            if (value[1] == category) {
                started.push({
                    'id': value[0],
                    'satus': value[2],
                    'todo': value[3]
                })
            }
        }
        else if (value[2] == 'done') {
            if (value[1] == category) {
                done.push({
                    'id': value[0],
                    'satus': value[2],
                    'todo': value[3]
                })
            }
        }
    }
    // Sending data to the list page
    //Source: https://pugjs.org/api/getting-started.html 
    res.render('list', { waiting: waiting, started: started, done: done, category: category.toUpperCase() })
})

//Loads form
app.get('/form', (req, res) => {
    res.render('form')
})

//Change status on todo items in list
app.get('/changestatus', (req, res) => {
    var q = req.query;
    var id = q.id;
    var status = q.status;
    var file = fs.readFileSync('todolist.txt');
    var lines = file.toString("utf8").split(/\r?\n/);

    var newData = "";
    for (var i = 0; i < lines.length - 1; i++) {
        var values = lines[i].split('#');
        if (values[0] == id) {
            console.log(status);
            if (status != 'delete') {
                newData = newData + id + "#" + values[1] + "#" + status + "#" + values[3] + "\n";
            }
        }
        else {
            newData = newData + values[0] + "#" + values[1] + "#" + values[2] + "#" + values[3] + "\n";
        }
    }
    //Source: https://www.geeksforgeeks.org/node-js-fs-unlinksync-method/
    fs.unlinkSync('todolist.txt');
    fs.appendFileSync('todolist.txt', newData);
    res.redirect("/");
})

//Add task to todo list
app.get('/add', (req, res) => {
    var q = req.query;
    category = q.category;
    var todo = q.todo.toString("utf8");
    var file = fs.readFileSync('todolist.txt');
    var lines = file.toString("utf8").split(/\r?\n/);
    var lastLine = lines[lines.length - 2].split('#');
    var newId = lastLine[0]*1+1;

    if (todo != "") {
        fs.appendFileSync('todolist.txt', newId + "#" + category + "#waiting#" + todo + "\n");
    }
    res.redirect('/')
})

app.listen(8080)
