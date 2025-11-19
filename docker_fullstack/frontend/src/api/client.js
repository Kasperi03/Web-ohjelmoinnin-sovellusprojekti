const BASE_URL = "http://localhost:3001";

async function request(path, method = "GET", body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(BASE_URL + path, options);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Request failed: ${res.status} ${errorText}`);
  }

  return res.json();
}

export default {
  get: (path) => request(path, "GET"),
  post: (path, body) => request(path, "POST", body),
  delete: (path) => request(path, "DELETE"),
  put: (path, body) => request(path, "PUT", body),
};
