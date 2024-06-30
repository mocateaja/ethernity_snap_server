import sql from '../connection';
import sqlcmd from '../sql';

const database = {
  start: async() => {
    try {
      await sql.unsafe(sqlcmd.start);
    } catch (error) {
      console.log(error);
    }
  },
  add_user: async({ user_name, password, created_at }: { [key: string]: string }) => {
    try {
      const response = await sql.unsafe(`
      ${sqlcmd.add_user}
        VALUES ('${user_name}','${password}','${created_at}');
      `);
      return response ? "success" : "failed"
    } catch (error) {
      console.log(error);
    }
  },
  add_image: async({
    image_id,
    title,
    description,
    sender_id,
    tag_id,
    created_at,
    data,
  }: {
    [key: string]: string | number[] | Date | '';
  }) => {
    try {
      const response = await sql.unsafe(`
        ${sqlcmd.add_image}
        VALUES ('${image_id}','${title}','${description}','${sender_id}',(SELECT user_name FROM users WHERE user_id = '${sender_id}'),ARRAY[${tag_id}],'${created_at}','${data}');
      `);
      return response ? "success" : "failed"
    } catch (error) {
      console.log(error);
    }
  },
  add_tag: async(tags: string[]) => {
    try {
      const values = tags.map((tag) => `('${tag}')`).join(',');
      await sql.unsafe(`
        ${sqlcmd.add_tag}
        VALUES ${values};
      `)
    } catch (error) {
      
    }
  },
  get_all_image: async({
    offset,
    limit,
  } : {
    offset: number,
    limit: number
  }) => {
    try {
      const data = await sql.unsafe(`
        ${sqlcmd.get_all_image}
        LIMIT ${limit}
        OFFSET ${offset};
      `);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  get_all_tag: async() => {
    try {
      const data = await sql.unsafe(`${sqlcmd.get_all_tag}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  search_image: async({ key } : { key: string}) => {
    key = key.toLowerCase()
    try {
      const data = await sql.unsafe(`
        ${sqlcmd.search_image}
        WHERE 
          LOWER(images.title) LIKE '%${key}%'
        GROUP BY 
          images.image_id, 
          images.title, 
          images.sender_id, 
          images.sender_name, 
          images.description, 
          images.created_at, 
          images.data
        ORDER BY 
          created_at DESC;    
      `);
      return data
    } catch (error) {
      console.log(error);
    }
  }
};

export default database;
