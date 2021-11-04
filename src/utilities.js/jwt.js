const jwt = require("jsonwebtoken");

const verify = (token, options = {}) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      secretPrivateKey,
      options || {
        algorithms: ["HS256"],
      },
      (err, decoded) => {
        if (err) {
          reject(new Error("INVALID_TOKEN"));
        } else {
          resolve(decoded);
        }
      },
    );
  });
}

const sign = (payload, options = {}) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { payload },
      secretPrivateKey,
      options || {
        algorithms: ["HS256"],
      },
      (err, decoded) => {
        if (err) {
          reject(new Error("NOT SIGN TOKEN"));
        } else {
          resolve(decoded);
        }
      },
    );
  });
}

module.exports = {
  verify,
  sign
}
