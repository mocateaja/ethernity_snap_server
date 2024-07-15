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
    width,
    height,
    data,
    data_hash
  }: {
    [key: string]: string | number[] | Date | '';
  }) => {
    try {
      const response = await sql.unsafe(`
        ${sqlcmd.add_image}
        VALUES ('${image_id}','${title}','${description}','${sender_id}',(SELECT user_name FROM users WHERE user_id = '${sender_id}'),ARRAY[${tag_id}],'${created_at}',${width},${height},'${data}','${data_hash}')
        ON CONFLICT (data_hash) DO NOTHING;
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
  specific_image: async(search_key: string) => {
    try {
      const data = await sql.unsafe(`
        ${sqlcmd.specific_image}
        WHERE image_id = '${search_key}'
        GROUP BY 
          images.image_id, 
          images.title, 
          images.sender_id, 
          images.sender_name, 
          images.description, 
          images.created_at, 
          images.width,
          images.height,
          images.data
      `);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  get_all_image_data: async() => {
    try {
      const data = await sql.unsafe(`
    SELECT 
      images.image_id,
      images.data,
      images.data_hash
    FROM 
      images
    GROUP BY 
      images.image_id, 
      images.data,
      images.data_hash
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
          images.width,
          images.height, 
          images.created_at, 
          images.data
        ORDER BY 
          created_at DESC;    
      `);
      return data
    } catch (error) {
      console.log(error);
    }
  },
  check_image: async({ image_hash } : { image_hash: string }) => {
    try {
      const data = await sql.unsafe(`
        SELECT EXISTS (
          SELECT 1
          FROM images
        WHERE data_hash = '${image_hash}'
          ) as image_exist
      `)
      return data
    } catch (error) {
      console.log(error);
    }
  },
  check_user_account: async({ user_id, password } : { user_id: string, password: string}) => {
    try {
      const data = await sql.unsafe(`
        ${sqlcmd.check_user_account}
        WHERE user_id = '${user_id}' AND password = '${password}'
        ) as user_exists
      `)
      return data
    } catch (error) {
      console.log(error);
    }
  },
  signin: async({ user_name, password } : { user_name: string, password: string}) => {
    try {
      const data = await sql.unsafe(`
        SELECT *
        FROM users
        WHERE user_name = '${user_name}' AND password = '${password}'
      `)
      return data
    } catch (error) {
      console.log(error);
    }
  }
};

export default database;
