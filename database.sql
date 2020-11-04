DROP DATABASE IF EXISTS foodfy;
CREATE DATABASE foodfy;

--DROP SCHEMA public CASCADE;
--CREATE SCHEMA public;


CREATE TABLE "files" (
	"id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text NOT NULL
);

CREATE TABLE "recipe_files" (
	"id" SERIAL PRIMARY KEY,
  "recipe_id" int,
  "file_id" int
);

CREATE TABLE "chefs" (
	"id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "file_id" int
);

CREATE TABLE "recipes" (
    "id" SERIAL PRIMARY KEY,
    "chef_id" int NOT NULL,
    "title" text NOT NULL,
    "ingredients" text[] NOT NULL,
    "preparation" text[] NOT NULL,
    "information" text NOT NULL,
    "created_at" TIMESTAMP DEFAULT (now()),
    "updated_at" TIMESTAMP DEFAULT (now())
);

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

ALTER TABLE "chefs" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "reset_token" text,
  "reset_token_expires" text,
  "is_admin" BOOLEAN DEFAULT false,
  "created_at" TIMESTAMP DEFAULT(now()),
  "updated_at" TIMESTAMP DEFAULT(now())
);

--add column user_id in recipes table
ALTER TABLE "recipes" ADD COLUMN user_id int;

ALTER TABLE "recipes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

--session table
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" 
ADD CONSTRAINT "session_pkey" 
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

--triggers
CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE FUNCTION trigger_set_timestamp_users()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp_users();