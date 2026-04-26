/**
 * Response formatting utilities
 * Standardize API responses
 */

export function successResponse(data, message = "Success") {
  return {
    success: true,
    message,
    data
  };
}

export function errorResponse(message, status = 500, details = null) {
  const response = {
    success: false,
    message,
    status
  };

  if (details) {
    response.details = details;
  }

  return response;
}

export function paginatedResponse(items, page, pageSize, total) {
  return {
    success: true,
    data: items,
    pagination: {
      page,
      pageSize,
      total,
      pages: Math.ceil(total / pageSize)
    }
  };
}
