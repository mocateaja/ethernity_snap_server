CREATE TABLE "Hobbys"(
    "id" INTEGER NOT NULL,
    "hobby_name" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "Hobbys" ADD PRIMARY KEY("id");
CREATE TABLE "Admin"(
    "id" CHAR(10) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "role_id" INTEGER NOT NULL
);
ALTER TABLE
    "Admin" ADD PRIMARY KEY("id");
CREATE TABLE "Gallery"(
    "id" CHAR(10) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "date" DATE NOT NULL
);
ALTER TABLE
    "Gallery" ADD PRIMARY KEY("id");
CREATE TABLE "Roles"(
    "id" INTEGER NOT NULL,
    "role_name" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "Roles" ADD PRIMARY KEY("id");
CREATE TABLE "Category"(
    "id" INTEGER NOT NULL,
    "category_name" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "Category" ADD PRIMARY KEY("id");
CREATE TABLE "Thumbnail_URL"(
    "id" CHAR(10) NOT NULL,
    "url" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "Thumbnail_URL" ADD PRIMARY KEY("id");
CREATE TABLE "Users"(
    "id" CHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "password" BIGINT NOT NULL
);
ALTER TABLE
    "Users" ADD PRIMARY KEY("id");
CREATE TABLE "Biodata"(
    "id" CHAR(10) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "gender" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "hobby_id" INTEGER NOT NULL,
    "quote" VARCHAR(255) NOT NULL,
    "role_id" INTEGER NOT NULL,
    "cohort" INTEGER NOT NULL
);
ALTER TABLE
    "Biodata" ADD PRIMARY KEY("id");
CREATE TABLE "Landing_Page"(
    "title" VARCHAR(255) NOT NULL,
    "sub_title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "banner_url" VARCHAR(255) NOT NULL
);
CREATE TABLE "Article"(
    "id" CHAR(10) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "body" VARCHAR(255) NOT NULL,
    "category_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "admin_id" CHAR(10) NOT NULL,
    "thumbnail_url_id" CHAR(255) NOT NULL
);
ALTER TABLE
    "Article" ADD PRIMARY KEY("id");
CREATE TABLE "Information"(
    "id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "body" VARCHAR(255) NOT NULL,
    "category" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "Information" ADD PRIMARY KEY("id");
CREATE TABLE "Organization_Roles"(
    "id" INTEGER NOT NULL,
    "role_name" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "Organization_Roles" ADD PRIMARY KEY("id");
ALTER TABLE
    "Biodata" ADD CONSTRAINT "biodata_role_id_foreign" FOREIGN KEY("role_id") REFERENCES "Organization_Roles"("id");
ALTER TABLE
    "Article" ADD CONSTRAINT "article_category_id_foreign" FOREIGN KEY("category_id") REFERENCES "Category"("id");
ALTER TABLE
    "Article" ADD CONSTRAINT "article_admin_id_foreign" FOREIGN KEY("admin_id") REFERENCES "Admin"("id");
ALTER TABLE
    "Admin" ADD CONSTRAINT "admin_role_id_foreign" FOREIGN KEY("role_id") REFERENCES "Roles"("id");
ALTER TABLE
    "Article" ADD CONSTRAINT "article_thumbnail_url_id_foreign" FOREIGN KEY("thumbnail_url_id") REFERENCES "Thumbnail_URL"("id");
ALTER TABLE
    "Biodata" ADD CONSTRAINT "biodata_hobby_id_foreign" FOREIGN KEY("hobby_id") REFERENCES "Hobbys"("id");