const router = require ('express').Router();
const verify = require ('../verifyToken');
const User  = require ('../../model/User');
const AppError = require('../../AppError');

//GET Friends


router.get('/',verify(['admin','user']), async (req,res,next)=> {

  let search = req.query.search;

  console.log('user :' , req.user.userId);
  
  // PAGINATION
  
  let order;
  let offset;
  let limit;

  if(req.query.order){
    if(req.query.order == 'ASC'){
      order = {createdAt: 1};
    }
    if(req.query.order == 'DESC'){
      order = {createdAt: -1};
    }
  }
  
  if(req.query.page && req.query.limit){
    offset = req.query.page * req.query.limit - req.query.limit;
    limit = parseInt(req.query.limit);
  }
  
  // FILTERING 
  
  let where = {};
  where.friendList = req.user.userId;
  
  if (req.query.name && req.query.name !== '' && req.query.name !== 'undefined'){
  
    where.name = req.query.name;
  }
  
  if (req.query.email && req.query.email !== '' && req.query.email !== 'undefined'){
  
    where.email = req.query.email;
  }

  // GET SEARCHED EVENTS
  
  try{
  

    let query = await User.find(where).skip(offset).limit(limit).sort(order);

    console.log('query:' , query);
    console.log('searched for:' , where);
    console.log('----------------------------------');
    console.log(query.friendList);

    let data = {
      rows: query,
      limit: req.query.limit,
      page: req.query.page
    };

    if(search && search !== '' && search !== 'undefined'){
      const searched = await User.find({$text: {$search: search}})
        .populate('friendList','name')
        .where({ members: req.user.userId })
        .skip(offset)
        .limit(limit)
        .sort(order);

      let count = await User.find({$text: {$search: search}})
        .where({ members: req.user.userId })
        .skip(offset)
        .limit(limit)
        .sort(order)
        .countDocuments();

      data.rows = searched;
      data.count = count;
    }

    let count = await User.find(where).countDocuments();
    data.count = count;

    return res.status(200).send({body: data, message: 'request succesful'});
  }
  catch(err){
    return next(new AppError(`cannot get friend. error message: ${err.message}`, 400));
  }
    
});



module.exports = router;