const router = require ('express').Router();
const getGroups = require ('./getGroups');
const createGroup = require ('./createGroup');
const addFriendToGroup = require ('./addFriendToGroup');
const confirmGroup = require ('./confirmGroup');
const removeFromGroup = require('./removeFromGroup');
const deleteGroup = require('./deleteGroup');
const checkGroup = require('./checkGroup');
const createPost = require('./createPost');



router.use('/', getGroups);
router.use('/', createGroup);
router.use('/', addFriendToGroup);
router.use('/', confirmGroup);
router.use('/', removeFromGroup);
router.use('/', deleteGroup);
router.use('/', checkGroup);
router.use('/', createPost);



module.exports = router;