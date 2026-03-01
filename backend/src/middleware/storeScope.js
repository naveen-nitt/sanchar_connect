const ensureStoreScope = (req, res, next) => {
  const scopedStoreId = req.params.storeId || req.body.store_id || req.query.store_id;
  if (req.user.role === 'admin') return next();
  if (!scopedStoreId || scopedStoreId !== req.user.store_id) {
    return res.status(403).json({ message: 'Cross-store access denied' });
  }
  return next();
};

module.exports = { ensureStoreScope };
