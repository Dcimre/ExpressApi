const router = require ('express').Router();
const getEvents = require('./getEvents');
const createEvent = require('./createEvent');
const inviteFriend = require('./inviteFriend');
const confirmEvent = require('./confirmEvent');
const removeEvent = require('./removeEvent');
const deleteEvent = require('./deleteEvent');
const checkEvent = require('./checkEvent');
const createPost = require('./createPost');


router.use('/',getEvents);
router.use('/', createEvent);
router.use('/', inviteFriend);
router.use('/', confirmEvent);
router.use('/', removeEvent);
router.use('/', deleteEvent);
router.use('/', checkEvent);
router.use('/', createPost);



module.exports = router;