// Usually we should use and repet Try/Catch with all Route
// becouse we deal with promise by async/await so instade of repeting try/catch
// we can use this middleware function to wrap oure route by passing the route
// as handler to this function
// this function it's like factory function
module.exports = function (handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (ex) {
      // send the ex to next middleware
      next(ex);
    }
  };
};

// we install express-async-errors and ues it to do the same so we don't need to wrap all
// our routes with this function
