const router = require("express").Router();
const Data = require("../models/Data");

    router.get('/data', async (req, res) => {
        try {
            const data = await Data.find();
            console.log('Retrieved data:', data); // Add this line for debugging
            res.json(data);
        } catch (error) {
            console.error('Error fetching data:', error); // Add this line for debugging
            res.status(500).json({ error: error.message });
        }
    });
    

    module.exports = router;
