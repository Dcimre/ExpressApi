const router = require ('express').Router();
const verify = require ('../verifyToken');
const Event  = require ('../../model/Event');
const AppError = require('../../AppError');

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
  
  where.participants = req.user.userId;

  if (req.query.name && req.query.name !== '' && req.query.name !== 'undefined'){

    where.name = req.query.name;
  }

  if (req.query.startDate && req.query.startDate !== ''&& req.query.startDate !== 'undefined'){
    where.startDate = {};
    where.startDate['$gte'] = req.query.startDate;
  }

  if (req.query.endDate && req.query.endDate !== ''&& req.query.organizer !== 'undefined'){
    where.endDate = {};

    where.endDate['$lte'] = req.query.endDate;
  }

  if (req.query._id && req.query._id !== ''){

    where._id = req.query._id;
  }
  // console.log('where :');
  // console.log(where);

  // BUILD QUERY
  try{
    let query = await Event
      .find(where)
      .skip(offset)
      .limit(limit)
      .sort(order)
      .exec();

    console.log(query);
    
    // let query = await Event
    //   .find(where)
    //   .skip(offset)
    //   .limit(limit)
    //   .sort(order);
    let data = {
      events: query,
      limit: req.query.limit,
      page: req.query.page
    };

    // IN CASE OF 'SEARCH' 

    if(search && search !== '' && search !== 'undefined'){
      const searched = await Event.find({$text: {$search: search}})
        .where({ participants: req.user.userId })
        .skip(offset)
        .limit(limit)
        .sort(order);

      let count = await Event.find({$text: {$search: search}})
        .where({ participants: req.user.userId })
        .skip(offset)
        .limit(limit)
        .sort(order)
        .countDocuments;

      data.rows = searched;
      data.count = count;
    }

    // GET EVENTS

    let count = await Event.find(where).countDocuments();
    data.count = count;

    return res.status(200).send({body: data, message: 'request succesfull!', });
  }
    
  catch(err){
    return next(new AppError(`cannot get events... ${err.message}`,400));
  }
});

module.exports = router;