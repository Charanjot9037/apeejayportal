export async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  let result = {};

  try {
    result = await response.json();
  } catch {
    result = {};
  }

  if (response.status === 401) {
    return {
      success: false,
      authError: true,
      status: 401,
      message: result.message || "Please login again.",
    };
  }

  if (response.status === 403) {
    return {
      success: false,
      authError: true,
      unauthorized: true,
      status: 403,
      message:
        result.message || "You are not authorized to access this resource.",
    };
  }

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return {
    success: true,
    data: result,
    status: response.status,
  };
}
