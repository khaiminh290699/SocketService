const { DB } = require("../db")
const jwt = require("./jwt")

async function authorize(socket, next) {
  try {
    // const token = socket.handshake.auth.token;

    // if (token) {
    //   const { payload: { id } } = await jwt.verify(token);
    //   const db = new DB().query();
    //   const user = await db("users").where({ id }).first();
    //   await db.destroy();
    //   if (user) {
    //     next();
    //     return;
    //   }
    // }
  
    // const err = new Error("Not authorized");
    // err.data = { content: "Please retry later" };
    // next(err);
    // return;

    next();
    return;
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = authorize;