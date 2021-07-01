const router = require ('express').Router();
const regRoute = require ('./registration');
const loginRoute = require ('./login');
const getUsersRoute = require ('./getUsers');
const deleteUserRoute = require ('./deleteUser');


router.use('/' , regRoute);
router.use('/' , loginRoute);
router.use('/' , getUsersRoute);
router.use('/' , deleteUserRoute);

module.exports = router;