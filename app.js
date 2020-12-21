const express = require('express')
const app = express()
var fs = require('fs');

app.set('view engine', 'pug')
app.set('views', './views')
app.use(express.static('css'));

var category = "work";

app.get('/', (req, res) => {
    
    if (req.query.category != undefined) {
        category = req.query.category;
    }
    console.log(category);
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
    res.render('list', { waiting: waiting, started: started, done: done, category: category.toUpperCase() })
})

app.get('/form', (req, res) => {
    res.render('form')
})

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
            console.log("test2")
            if (values[2] != 'delete') {
                newData = newData + id + "#" + values[1] + "#" + status + "#" + values[3] + "\n";
            }
        }
        else {
            newData = newData + values[0] + '#' + values[1] + "#" + values[2] + '#' + values[3] + "\n"
        }
    }
    fs.unlinkSync('todolist.txt');
    fs.appendFileSync('todolist.txt', newData);
    res.redirect("/");
})

app.get('/add', (req, res) => {
    var q = req.query;
    category = q.category;
    console.log(q);
    var todo = q.todo.toString("utf8");
    var file = fs.readFileSync('todolist.txt');
    var lineCount = file.toString("utf8").split(/\r?\n/).length;
    fs.appendFileSync('todolist.txt', lineCount + "#" + category+ "#waiting#" + todo + "\n");
    res.redirect('/')
})

app.listen(8080)
