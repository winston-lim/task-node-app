const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth');
const { request } = require('express');
const multer = require('multer');
  
const router = new express.Router()

router.post('/users', async (request, response) => {
    const user = new User(request.body)
    try {
        await user.save(); //this is to hash and store password;
        await User.login(request.body.email, request.body.password);
        const token = await user.generateAuthToken();
        response.status(201).send({user,token})
    } catch (e) {
        response.status(400).send(e)
    }
})

router.post('/users/login', async(request,response)=> {
  try {
    const user = await User.login(request.body.email, request.body.password);
    const token = await user.generateAuthToken();
    response.send({user, token});
  } catch(e) {
    response.status(400).send();
  }
})

router.post('/users/logout', auth, async (request,response)=> {
    try {
        request.user.tokens = request.user.tokens.filter((token)=>token.token!==request.token);
        await request.user.save();
        response.send();
    } catch (e) {
        response.status(500).send();
    }
})

router.post('/users/logoutAll', auth, async (request,response)=> {
    try {
        request.user.tokens = [];
        await request.user.save();
        response.send();
    } catch (e) {
        response.status(500).send();
    }
})

router.get('/users/me', auth ,async (request, response) => {
    response.send(request.user);
})

router.patch('/users/me', auth, async (request, response) => {
    const updates = Object.keys(request.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return response.status(400).send({ error: 'Invalid updates!' });
    }
    try {
        updates.forEach((update) => request.user[update] = request.body[update])
        await request.user.save()
        response.send(request.user);
    } catch (e) {
        response.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (request, response) => {
    try {
        await request.user.remove();
        response.send(request.user);
    } catch (e) {
        res.status(500).send()
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(request, file, callback) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error('Unsupported file type(s)'));
        }
        callback(undefined,true);
    }
})

router.post('/users/me/avatar', auth,upload.single('avatar'), async (request,response)=> {
    request.user.avatar = request.file.buffer;
    await request.user.save();
    response.send();
  }, (error,request,response, next)=>response.status(400).send(error.message));

router.delete('/users/me/avatar', auth, async (request,response)=> {
    if (!request.user.avatar) {
        return response.status(400).send({message: 'Avatar does not exist'});
    }
    request.user.avatar = undefined;
    await request.user.save();
    response.send({message: 'Avatar deleted!'});
})
router.get('/users/:id/avatar', async (request,response)=> {
    try {
        const user = await User.findById(request.params.id);
        if (!user || !user.avatar) {
            throw new Error();
        }
        response.set('Content-Type', 'image/jpg');
        //default Content-Type was set to 'application/json' for us by express
        //now we say that the return type is jpg
        response.send(user.avatar);
    } catch (e) {
        response.status(404).send();
    }  
})
module.exports = router;