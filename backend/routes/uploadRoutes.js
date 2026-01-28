const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

router.post('/', upload.single('image'), (req, res) => {
    res.send({
        message: 'Image uploaded',
        // Return valid URL path regardless of file system path
        image: `/uploadsbyvenders/${req.file.filename}`,
    });
});

module.exports = router;
