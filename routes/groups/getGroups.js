const router = require ('express').Router();
const verify = require ('../verifyToken');
const Group  = require ('../../model/Group');
const AppError = require('../../AppError');

//GET GROUPS

router.get('/',verify(['admin','user']), async (req,res,next)=> {

  let search = req.query.search;

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
  where.members = req.user.userId;

  if (req.query.name && req.query.name !== '' && req.query.name !== 'undefined'){

    where.name = req.query.name;
  }

  if (req.query.creator && req.query.creator !== '' && req.query.creator !== 'undefined'){

    where.creator = req.query.creator;
  }

  // GET SEARCHED GROUPS

  try{
    
    let query = await Group
      .find(where)
      .populate('members','name')
      .skip(offset)
      .limit(limit)
      .sort(order);

    console.log(`found: ${query}`);

    let data = {
      rows: query,
      limit: req.query.limit,
      page: req.query.page
    };

    if(search && search !== '' && search !== 'undefined'){
      const searched = await Group.find({$text: {$search: search}})
        .populate('members','name')
        .where({ members: req.user.userId })
        .skip(offset)
        .limit(limit)
        .sort(order);

      let count = await Group.find({$text: {$search: search}})
        .where({ members: req.user.userId })
        .skip(offset)
        .limit(limit)
        .sort(order)
        .countDocuments();

      data.rows = searched;
      data.count = count;
    }

    let count = await Group.find(where).countDocuments();
    data.count = count;

    return res.status(200).send({body: data, message: 'request succesfull!'});
  }
  catch(err){
    return next(new AppError(`request failed. error message: ${err.message}`,400));
  }
    
});

module.exports = router;