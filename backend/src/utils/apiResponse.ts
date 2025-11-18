/**
 * Generates a standardized success response object.
 * @param data The payload to be sent in the response.
 * @param metadata Optional metadata, e.g., for pagination.
 */
export const successResponse = <T>(data: T, metadata?: object) => {
  return {
    success: true,
    data,
    ...(metadata && { metadata }),
  };
};

/**
 * Generates a standardized error response object.
 * @param code A unique code for the error type.
 * @param message A human-readable error message.
 * @param details Optional details about the error, e.g., validation issues.
 */
export const errorResponse = (code: string, message: string, details?: any) => {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  };
};
