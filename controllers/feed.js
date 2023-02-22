const Post = require('../models/post');
const User = require('../models/user');
const { deleteFile } = require('../util/file');
const io = require('../socket');

exports.getPosts = async (req, res, next) => {
  try {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .populate('creator');
    res.status(200).json({
      posts,
      totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate('creator');
    if (!post) {
      return res.status(404).json({ message: 'Could not find a post' });
    }
    res.status(200).json({ post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);
    if (!req.file) {
      return res.status(422).json({ message: 'No image provided.' });
    }
    const imageUrl = req.file.path.replace('\\', '//');
    const post = new Post({ ...req.body, imageUrl, creator: userId });
    user.posts.push(post);
    await post.save();
    await user.save();
    const socket = io.getIO();
    socket.emit('posts', {
      action: 'create',
      post: {
        ...post._doc,
        creator: { _id: userId, name: user.name }
      },
    });
    res.status(201).json({
      message: 'Post created successfully',
      post,
      creator: user,
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.updatePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId } = req;
    if (!req.file) {
      return res.status(422).json({ message: 'No image provided.' });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Could not find a post' });
    }
    const { imageUrl: previousImage, creator } = post;
    if (!creator.equals(userId)) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }
    const imageUrl = req.file.path.replace('\\', '//');
    await deleteFile(previousImage);
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      { ...req.body, imageUrl, creator, },
      { new: true },
    ).populate('creator');
    const socket = io.getIO();
    socket.emit('posts', {
      action: 'update',
      post: updatedPost._doc,
    });
    res.status(200).json({
      message: 'Post updated successfully',
      post: updatedPost,
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { userId } = req;
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Could not find a post' });
    }
    const { imageUrl, creator } = post;
    if (!creator.equals(userId)) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }
    const user = await User.findById(userId);
    const { posts } = user;
    await posts.pull(postId);
    await user.save();
    await Post.deleteOne({ _id: postId });
    await deleteFile(imageUrl);
    const socket = io.getIO();
    socket.emit('posts', {
      action: 'delete',
    });
    res.status(200).json({
      message: 'Post deleted successfully',
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};