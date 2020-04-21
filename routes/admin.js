const router = require('express').Router();
const todo = require('../repos/todolist');
const employeelist = require('../repos/employeelist');

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


router.get('/', async(req, res)=>{
    const preparedList = await retrieveAll();
    res.render('admin', {
        employeelist,
        preparedList
        })
});

router.post('/create', async (req, res) =>{
    const newdata = {
        task: req.body.task,
        department: req.body.department,
        staff: req.body.staff,
        status: req.body.status
    }
    const result = await postOne(newdata)
    res.redirect('/admin')
});


module.exports = router;