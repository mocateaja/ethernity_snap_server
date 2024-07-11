const sqlcmd = {
  start: `
CREATE TABLE IF NOT EXISTS users (
    user_id CHAR(8) PRIMARY KEY NOT NULL,
    user_name VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMETSAMPZ NOT NULL
);
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    tag VARCHAR(255) NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS images (
    image_id CHAR(10) PRIMARY KEY NOT NULL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    sender_id CHAR(8) NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    tag_id INT[],
    created_at TIMETSAMPZ NOT NULL,
    data TEXT NOT NULL,
    FOREIGN KEY (sender_id) REFERENCES users(user_id)
);

--CREATE SEQUENCE user_id_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE FUNCTION formatted_user_id() RETURNS TRIGGER AS $$
BEGIN
    NEW.user_id := to_char(nextval('user_id_seq'), 'FM00000000');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_id
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION formatted_user_id();
    `,
  add_user: `
INSERT INTO users (user_name, password, created_at)
        `,
  add_image: `
INSERT INTO images (image_id, title, description, sender_id, sender_name, tag_id, created_at, width, height, data, data_hash)
    `,
  add_tag: `
INSERT INTO tags (tag)
    `,
  get_all_image: `
SELECT 
  images.image_id,
  images.title,
  images.sender_id,
  images.sender_name,
  images.description,
  images.created_at,
  images.width,
  images.height,
  images.data,
  array_agg(tags.name) AS categories
FROM 
  images
INNER JOIN 
  tags ON tags.id = ANY(images.tag_id)
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
ORDER BY created_at DESC
    `,
  specific_image: `
SELECT 
  images.image_id,
  images.data
FROM 
  images
  `,
  get_all_tag: `
SELECT * FROM tags;
    `,
  search_image: `
SELECT 
  images.image_id,
  images.title,
  images.sender_id,
  images.sender_name,
  images.description,
  images.created_at,
  images.width,
  images.height,
  array_agg(tags.name) AS categories
FROM 
  images
INNER JOIN 
  tags ON tags.id = ANY(images.tag_id)
GROUP BY 
  images.image_id, 
  images.title, 
  images.sender_id, 
  images.sender_name, 
  images.description, 
  images.created_at, 
  images.width,
  images.height
    `,
    check_user_account: `
SELECT EXISTS (
    SELECT 1
    FROM users
    `,
};

export default sqlcmd;
