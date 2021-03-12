const expresponses = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth');
const router = new expresponses.Router()

router.post('/tasks', auth, async (request, response) => {
    const task = new Task({...request.body, owner: request.user._id})
    try {
        await task.save()
        response.status(201).send(task)
    } catch (e) {
        response.status(400).send(e)
    }
})

router.get('/tasks', auth, async (request, response) => {
    try {
        const match = {};
        const sort = {};
        if (request.query.completed) {
            match.completed = request.query.completed === 'true'
        }
        if (request.query.sortBy) {
            const parts = request.query.sortBy.split(":");
            sort[parts[0]] = parts[1]==='asc'? 1: -1;
        }
        await request.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(request.query.limit),
                skip: parseInt(request.query.skip),
                sort,
            }
        }).execPopulate();
        response.send(request.user.tasks);
    } catch (e) {
        response.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (request, response) => {
    const _id = request.params.id

    try {
        const task = await Task.findOne({_id, owner: request.user._id})
        if (!task) {
            return response.status(404).send()
        }
        response.send(task)
    } catch (e) {
        response.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (request, response) => {
    const updates = Object.keys(request.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return response.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const task = await Task.findOne({_id:request.params.id, owner:request.user._id})
        if (!task) {
            return response.status(404).send()
        }
        updates.forEach((update) => task[update] = request.body[update])
        await task.save()
        response.send(task)
    } catch (e) {
        response.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (request, response) => {
    try {
        const task = await Task.findOneAndDelete({_id : request.params.id, owner: request.user._id})
        if (!task) {
            response.status(404).send()
        }
        response.send(task)
    } catch (e) {
        response.status(500).send()
    }
})

module.exports = router