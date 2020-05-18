const express = require('express');

const bloggerController = require('../controllers/bloggerController');

const router = express.Router();

/** Blogger Routes **/

// GET: catalogue of bloggers
router.get('/bloggers', bloggerController.getBloggerList);

// GET: specific blogger detail
router.get('/detail/:id', bloggerController.getBloggerDetail);

// GET: specific blogger intro form
router.get('/fill/:id', bloggerController.getBloggerForm);

// POST: specific blogger info form
router.post('/fill/:id', bloggerController.postBloggerForm);

// GET: blogger wall
router.get('/wall', bloggerController.getBloggerWall);

// GET: blogger wall edit
router.get('/wall/edit', bloggerController.getWallEdit);

// POST: blogger wall edit
router.post('/wall/edit', bloggerController.postWallEdit);

// POST: blogger star
router.post('/star/:id', bloggerController.postStar);

module.exports = router;
