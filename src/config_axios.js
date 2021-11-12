
export const get = (route) => {
  const request = {
    method: 'get',
    url: route,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
  };
  return request;
};
