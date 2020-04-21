const express = require('express');
const employees = require('./repos/employeelist');

const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
let todolist;

const client = new MongoClient(url, { useUnifiedTopology: true });

(async () => {
    await client.connect();
    const database = await client.db('employeedb');
    todolist = database.collection('todo');
})();

const postMany = async (data) => {
    try {
        const incoming = await todolist.insertMany(data)
        return incoming;
    } catch (error) {
        console.log(error)
    }
}
const postOne = async (data) => {
    try {
        const incoming = await todolist.insertOne(data)
        return incoming;
    } catch (error) {
        console.log(error)
    }
} 
const retrieveAll = async () => {
    try {
        const incoming = await todolist.find({}).toArray()
        return incoming;
    } catch (error) {
        console.log(error)
    }
}


const app = express();//App server

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use('/admin', require('./routes/admin'));



//Root Route
app.get('/', (req, res) =>{  
    res.render('home', {
        employees
    });
});

app.get('/todolist', async(req, res)=>{
    const preparedList = await retrieveAll();
    res.render('todolist', {
        preparedList
        })
});
       

// Start application on port 5000
const port = 5000;
app.listen(port, ()=>{
    console.log(`Server has started on port 5000`);
});