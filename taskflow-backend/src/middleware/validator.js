const validateTask = (req, res, next) => {
  const { title, status, priority } = req.body;

  if (req.method === 'POST') {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: Title is required and must be a non-empty string.'
      });
    }
  }

  if (status && !['pending', 'in-progress', 'completed'].includes(status)) {
    return res.status(400).json({
      success: false,
      error: "Validation Error: Status must be 'pending', 'in-progress', or 'completed'."
    });
  }

  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({
      success: false,
      error: "Validation Error: Priority must be 'low', 'medium', or 'high'."
    });
  }

  next();
};

module.exports = { validateTask };