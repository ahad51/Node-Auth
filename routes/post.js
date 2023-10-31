const router = require("express").Router();
const verify = require('./verifyToken')


router.get("/",verify, async (req, res) => {
    res.json({ posts: { title: 'my first node authentication application', description: 'random data' } });
});

module.exports = router;
