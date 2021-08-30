DROP TABLE IF EXISTS users cascade;

CREATE TABLE users(
     id SERIAL PRIMARY KEY,
     first VARCHAR NOT NULL,
     last VARCHAR NOT NULL,
     email VARCHAR UNIQUE NOT NULL,
     hashed_password VARCHAR NOT NULL,
     timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 ); 

DROP TABLE IF EXISTS report;
 CREATE TABLE report(
     id SERIAL PRIMARY KEY,
     user_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL, 
     who TEXT NOT NULL,
     what TEXT NOT NULL,
     whenHappened TIMESTAMP NOT NULL,
     why TEXT NOT NULL,
     whereHappened TEXT NOT NULL,
     longitude TEXT NOT NULL,
     latitude TEXT NOT NULL,
     linkId  INT REFERENCES links(id) ON DELETE CASCADE, 
     timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );  

 DROP TABLE IF EXISTS links cascade;
  CREATE TABLE links(
     id SERIAL PRIMARY KEY,
     user_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL, 
     headline TEXT NOT NULL,
     link TEXT NOT NULL, 
     code TEXT NOT NULL, 
     hashedCode TEXT NOT NULL,
     publicOrNot BOOLEAN, 
     timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );   


  DROP TABLE IF EXISTS organizations;
  CREATE TABLE organizations(
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL, 
    email TEXT NOT NULL,
     timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );   


INSERT INTO organizations (name, email) VALUES ('Frontline Defenders', 'frd@frd.org');
