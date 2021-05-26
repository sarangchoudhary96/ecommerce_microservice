export default (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);


// "git://github.com/sarangchoudhary96/RMQ_with_nodejs.git#master"