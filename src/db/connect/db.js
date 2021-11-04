const knex = require("knex");

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, MIGRATION_PATH } = process.env;

class DB {
  constructor(){
    this.connection = knex.knex({
      client: "pg",
      connection: {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        port: DB_PORT, 
      },
      migrations: {
        directory: MIGRATION_PATH
      }
    })
  };

  query = (table) => {
    return this.connection.from(table);
  }

  migrate = () => {
    return this.connection.migrate.latest();
  }

  queryByCondition = (table, wheres, page, limit, order = {}) => {
    const operators = {
      "$eq": "=",
      "$ne": "!=",
      "$lt": "<",
      "$gt": ">",
      "$lte": "<=",
      "$gte": ">="
    }
    const query = wheres.reduce((query, where) => {
      let key = Object.keys(where)[0];
      const operator = Object.keys(where[key])[0];
      const value = where[key][operator];

      if (key.includes("->>") || key.includes("->")) {
        key = this.connection.raw(`${key}`);
      }

      if (operators[operator]) {
        query.where(key, operators[operator], value)
      }

      switch(operator) {
        case "$empty": {
          if (value) {
            query.whereNull(key);
          } else {
            query.whereNotNull(key);
          }
          break;
        }
        case "$nempty": {
          if (!value) {
            query.whereNull(key);
          } else {
            query.whereNotNull(key);
          }
          break;
        }
        case "$in": {
          query.whereIn(key, value);
          break;
        }
        case "$nin": {
          query.whereNotIn(key, value);
          break;
        }
        case "$between": {
          query.whereBetween(key, value);
          break;
        }
        case "$nbetween": {
          query.whereNotBetween(key, value);
          break;
        }
      }
      return query;
    }, this.query(table));

    const orderKeys = Object.keys(order);
    orderKeys.reduce((query, orderKey) => {
      query.orderBy(orderKey, order[orderKey] === 1 ? "DESC" : "ASC");
      return query;
    }, query);

    if (limit != null) {
      query.limit(limit).offset((page - 1) * limit);
    }

    return query;
  }
}
module.exports = DB;