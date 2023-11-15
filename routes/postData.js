const router = require("express").Router();
const Data=require('../models/Data')

router.post('/createData', async (req, res) => {
    try {
        const newData = new Data();

        newData.name = req.body.name;
        newData.description = req.body.description;

        await newData.save();

        res.status(201).json(newData); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;