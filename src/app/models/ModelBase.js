const db = require('../../config/db');

function find(filters, table, orderBy = null, topRecords = 0)
{
  let sqlStatement = `select * from ${table} `;

  if (filters)
  {
    Object.keys(filters).map(key =>
    {
      sqlStatement += ` ${key}`;

      Object.keys(filters[key]).map(field => 
      {
        sqlStatement += ` ${field} = '${filters[key][field]}'`;
      });

    });
  }

  sqlStatement += orderBy ? ` order by ${orderBy}` : '';

  sqlStatement += topRecords > 0 ? ` limit ${topRecords}` : '';

  return db.query(sqlStatement);
}

const ModelBase = {
  init({ table })
  {
    if (!table)
      throw new Error('Invalid params. A table is required');

    this.table = table;
  },

  async findById(id)
  {
    const results = await find({ where: { id } }, this.table);
    return results.rows[0];
  },

  async findOne(filters)
  {
    const results = await find(filters, this.table);
    return results.rows;
  },

  async findAll(filters, orderBy = null)
  {
    const results = await find(filters, this.table, orderBy);
    return results.rows;
  },

  async findTop(filters, orderBy = null, limit = 0)
  {
    const results = await find(filters, this.table, orderBy, limit);
    return results.rows;
  },

  async findLike(filters, limit = 0, orderBy = null)
  {
    let sqlStatement = `select * from ${this.table} `;

    if (filters)
    {
      Object.keys(filters).map(key =>
      {
        sqlStatement += ` ${key}`;

        Object.keys(filters[key]).map(field => 
        {
          sqlStatement += ` lower(${field}) like '%${filters[key][field].toLowerCase()}%'`;
        });

      });
    }

    sqlStatement += orderBy ? ` order by ${orderBy}` : '';

    sqlStatement += limit > 0 ? ` limit ${limit}` : '';

    const results = await db.query(sqlStatement);

    return results.rows;
  },

  async create(fields)
  {
    let query = '';
    try 
    {
      let keys = [];
      let values = [];

      Object.keys(fields).map(key =>
      {
        if (key != 'id')
        {
          keys.push(key);
          if (Array.isArray(fields[key]))
          {
            let arr = fields[key].map(item => `'${item}'`).join(', ');
            values.push(`array[${arr}]`);
          }
          else
            values.push(`'${fields[key]}'`);
        }
      });

      query = `insert into ${this.table} (${keys.join(',')}) values (${values.join(',')}) returning id`;

      const results = await db.query(query);
      return results.rows[0].id;

    } catch (error) 
    {
      console.error(error);
    }
  },

  async update(id, fields)
  {
    let query = '';
    try 
    {
      let update = [];

      Object.keys(fields).map((key) =>
      {
        if (key != 'id')
        {
          if (Array.isArray(fields[key]))
          {
            let arr = fields[key].map(item => `'${item}'`).join(', ');
            update.push(`${key} = array[${arr}]`);
          }
          else
            update.push(`${key} = '${fields[key]}'`);
        }
      });

      query = `update ${this.table} set ${update.join(',')} where id = ${id}`;

      return await db.query(query);

    } catch (error)
    {
      console.error(query);
      console.error(error);
    }
  },

  async delete(id)
  {
    let sqlStatement = `delete from ${this.table} where id = $1`;
    try
    {
      return await db.query(sqlStatement, [id]);
    } catch (error)
    {
      console.log(sqlStatement);
      console.erro(error);
    }
  }
};

module.exports = ModelBase;