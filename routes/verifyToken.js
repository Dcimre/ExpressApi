const jwt = require ('jwt-simple');

module.exports = (permission)=>{
    
  return (req, res, next)=>{

    const token = req.header('Bearer-token');
    if (!token){
      return res.status(401).send ('Access denied!');
    }
    try{
      const decoded = jwt.decode(token, process.env.TOKEN_SECRET);

      console.log('-------DECODED:--------');
      console.log(decoded);
      console.log('-----------------------');

      req.user = decoded;
      const userRole = req.user.role;

      const found = userRole.some( u=> permission.includes(u));
      
      if (found){
      
        next();
     
      }
      else{
      
        res.status(401).send({body: 'you dont have permission to do this'});
      }
    }
    catch(err){
      res.status(400).send({body:'Invalid, or missing token!'});
    }};
};

  
   


