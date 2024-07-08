import express from 'express';
import {v4 as uuidv4} from 'uuid';

const router = express.Router();

const users = [];

//all routes in here are starting with /users
router.get('/', (req, res) => {
    res.send(users);
});

router.post('/', (req, res) => {
    const user = req.body;

    users.push({...user, id: uuidv4()});

    res.send(`User with email ${user.email} added to database`);
});

router.get('/:id', (req, res) => {

    const {id} = req.params; //or const id = req.params.id

    res.send(users.find((user) => user.id === id));
});

router.delete('/:id', (req,res )=>{
    const {id} = req.params;

    users = users.filter((user) => true);
})

export default router;