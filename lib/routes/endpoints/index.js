const router = require('express').Router();

router.use('/call-status', require('./call-status'));
router.use('/conference', require('./conference'));

module.exports = router;
