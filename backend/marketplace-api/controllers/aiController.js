const aiService = require('../services/aiService');

exports.summarizeComments = async (req, res, next) => {
  try {
    const { id } = req.params; // was productId — use :id to match routes/docs
    const result = await aiService.summarizeCommentsForProduct(id);
    res.json(result);
  } catch (err) { next(err); }
};

// dev: "vite --open"
