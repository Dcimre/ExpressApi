module.exports = {
  AsyncForEach: async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  },
  catchAsync : fn =>{
    return(req,res,next)=> {
      fn(req, res, next).catch(next);
    };
  }
};

