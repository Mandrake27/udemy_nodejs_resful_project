const express = require('express');

const feedController = require('../controllers/feed');
const { requirementsArr, postValidation } = require('../middlewares/post-validation');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

router.get('/posts', isAuth, feedController.getPosts);

router.post('/post', isAuth, ...requirementsArr, postValidation, feedController.createPost);

router.get('/posts/:postId', isAuth, feedController.getPost);

router.put('/posts/:postId', isAuth, ...requirementsArr, postValidation, feedController.updatePost);

router.delete('/posts/:postId', isAuth, feedController.deletePost);

module.exports = router;