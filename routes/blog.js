const express = require('express');

const blogController = require('../controllers/blogController');

const router = express.Router();

/** Blog Routes **/

// GET: blogfeed
router.get('/blogfeed', blogController.getBlogfeed);

// GET: write blog
router.get('/write', blogController.getWrite);
// POST: write blog
router.post('/write', blogController.postWrite);

// GET: edit blog
router.get('/edit/:id', blogController.getEdit);
// POST: edit blog
router.post('/edit/:id', blogController.postEdit);

// GET: comment blog
router.get('/comment/:id', blogController.getComment);
// POST: comment blog
router.post('/comment/:id', blogController.postComment);

// GET: specific blog details
router.get('/detail/:id', blogController.getBlogDetail);

// POST
router.post('/action/:id', blogController.postBlogAction);

module.exports = router;
