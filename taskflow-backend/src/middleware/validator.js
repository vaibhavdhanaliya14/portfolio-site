const validateTask = (req, res, next) => {
  const { title, description, status, priority, dueDate, completed } = req.body;

  if (req.method === 'POST') {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: Title is required and must be a non-empty string.'
      });
    }
  }

  if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0 || title.trim().length > 120)) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error: Title must be between 1 and 120 characters.'
    });
  }

  if (description !== undefined && (typeof description !== 'string' || description.trim().length > 500)) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error: Description cannot exceed 500 characters.'
    });
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

  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error: Completed must be a boolean.'
    });
  }

  if (dueDate && Number.isNaN(Date.parse(dueDate))) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error: Due date must be a valid date.'
    });
  }

  next();
};

module.exports = { validateTask };
