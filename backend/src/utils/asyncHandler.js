// const asyncHandlerex = (fn) => {
//   return async() => {
//     console.log("");
//   };
// };
// const asyncHandler = (fn) => () => {};

// async await handler
// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req,res,next)
//   } catch (err) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// //promise handler
// const asyncHandler = (fn) =>{
//   (req, res, next) => Promise.resolve(fn(req,res,next)).catch((err) => next(err));
// };

//promise handler
const asyncHandler = (fn) => (req,res,next) =>
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));

export { asyncHandler };
