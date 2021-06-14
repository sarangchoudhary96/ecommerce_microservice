export const byPassRoutes = (middleware, paths) => {
  const middlewareWrapper = (req, res, next) => {
    const ignoreUrl = req.originalUrl.replace(/\?.*$/, "");

    const ignoreThisPath = paths.some(
      (routePath) => routePath === ignoreUrl || `${routePath}/` === ignoreUrl
    );

    if (ignoreThisPath) {
      return next();
    }
    return middleware(req, res, next);
  };

  return middlewareWrapper;
};
