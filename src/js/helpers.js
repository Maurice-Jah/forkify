import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// send an get data from api
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const res = uploadData
      ? await Promise.race([
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadData),
          }),
          timeout(TIMEOUT_SEC),
        ])
      : await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} ${res.status}`);

    return data;
  } catch (err) {
    throw err;
  }
};
