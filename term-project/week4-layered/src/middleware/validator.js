// src/validators/validator.js

const VALID_STATUSES = ['pending', 'in-progress', 'done'];

/**
 * Validate task ID
 */
function validateTaskId(id) {
  if (!id) {
    throw new Error('Task ID is required');
  }

  const parsedId = Number(id);
  if (Number.isNaN(parsedId) || parsedId <= 0) {
    throw new Error('Task ID must be a positive number');
  }
}

/**
 * Validate task creation input
 */
function validateCreateTask(data) {
  const { title, description, status } = data;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    throw new Error('Title is required and must be a non-empty string');
  }

  if (description && typeof description !== 'string') {
    throw new Error('Description must be a string');
  }

  if (status && !VALID_STATUSES.includes(status)) {
    throw new Error(
      `Status must be one of: ${VALID_STATUSES.join(', ')}`
    );
  }
}

/**
 * Validate task update input
 */
function validateUpdateTask(data) {
  const { title, description, status } = data;

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      throw new Error('Title must be a non-empty string');
    }
  }

  if (description !== undefined && typeof description !== 'string') {
    throw new Error('Description must be a string');
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    throw new Error(
      `Status must be one of: ${VALID_STATUSES.join(', ')}`
    );
  }
}

/**
 * Validate status transition (for PATCH next-status)
 */
function validateStatusTransition(currentStatus, nextStatus) {
  if (!VALID_STATUSES.includes(nextStatus)) {
    throw new Error(
      `Next status must be one of: ${VALID_STATUSES.join(', ')}`
    );
  }

  const validTransitions = {
    'pending': ['in-progress'],
    'in-progress': ['done'],
    'done': []
  };

  if (!validTransitions[currentStatus].includes(nextStatus)) {
    throw new Error(
      `Invalid status transition from "${currentStatus}" to "${nextStatus}"`
    );
  }
}

module.exports = {
  validateTaskId,
  validateCreateTask,
  validateUpdateTask,
  validateStatusTransition
};
