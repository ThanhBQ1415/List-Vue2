export function apiSuccess(data: any, extra: object = {}) {
  return {
    success: true,
    data,
    ...extra
  };
}

export function apiError(error: string, statusCode: number = 500, extra: object = {}) {
  return {
    success: false,
    error,
    statusCode,
    ...extra
  };
}
