const router = require ('express').Router();
const confirmFriend = require('./confirmFriend');
const addFriend = require('./addFriend');
const getFriends = require('./getFriends');
const removeFriend = require('./removeFriend');


router.use('/', confirmFriend);
router.use('/', addFriend);
router.use('/', getFriends);
router.use('/', removeFriend);


module.exports = router;