const router = require ('express').Router();
const verify = require ('../verifyToken');
const User  = require ('../../model/User');
const AppError = require('../../AppError');


//GET EVENTS ( ONLY ADMIN )

router.get('/',verify(['admin']), async (req,res,next)=> {

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
  let where = {};
  let search = req.query.search;

  // FILTERING 

  if (req.query.name && req.query.name !== '' && req.query.name !== 'undefined'){
  
    where.name = req.query.name;
  }
  if (req.query.email && req.query.email !== '' && req.query.email !== 'undefined'){
  
    where.email = req.query.email;
  }
  if (req.query._id && req.query._id !== ''){
  
    where._id = req.query._id;
  }
  // GET SEARCHED EVENTS
  
  try{
    
    let query = await User
      .find(where)
      .populate('friendList', 'name',)
      .populate('groups', 'name')
      .populate('events','name')
      .skip(offset)
      .limit(limit)
      .sort(order);

    let data = {
      rows: query,
      limit: req.query.limit,
      page: req.query.page
    };

    if(search && search !== '' && search !== 'undefined'){

      const searched = await User.find({$text: {$search: search}})
        .populate('friendList')
        .exec()
        .skip(offset)
        .limit(limit)
        .sort(order);

      let count = await User.find({$text: {$search: search}})
        .skip(offset)
        .limit(limit)
        .sort(order)
        .countDocuments();

      data.rows = searched;
      data.count = count;
    }
    return res.status(200).send({body: data, message: 'request succesful'});
  }
  catch(err){
    return next(new AppError('Cant find User on this server', 404));
  }
  
});
module.exports = router;