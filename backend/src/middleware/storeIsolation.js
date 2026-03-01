const enforceStoreScope = (req, res, next) => {
  if (req.user.role === 'admin') return next();
  const requestedStore = req.params.storeId || req.query.store_id || req.body.store_id;
  if (requestedStore && requestedStore !== req.user.store_id) {
    return res.status(403).json({ message: 'Store scope violation' });
  }
  req.storeScope = req.user.store_id;
  return next();
};

module.exports = enforceStoreScope;
