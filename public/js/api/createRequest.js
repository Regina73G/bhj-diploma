/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  const { url, method = "GET", data, callback } = options;
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      callback(null, xhr.response);
    } else {
      const error = new Error(`Ошибка запроса ${xhr.status}: ${xhr.statusText}`);
      callback(error, null);
    }
  }

  xhr.onerror = () => {
    const error = new Error("Ошибка сети");
    callback(error, null);
  }

  let urlFull = url;

  if (method === "GET" && data) {
    const queryString = Object.entries(data)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

    urlFull += (urlFull.includes('?') ? '&' : '?') + queryString;
  }

  xhr.open(method, urlFull);

  if (method !== 'GET' && data) {
    const formData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }
    xhr.send(formData);
  } else {
    xhr.send();
  }
};