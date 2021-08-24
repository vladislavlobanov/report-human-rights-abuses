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
     whenHappened TEXT NOT NULL,
     why TEXT NOT NULL,
     longitude TEXT NOT NULL,
     latitude TEXT NOT NULL,
    linkId  INT REFERENCES links(id) ON DELETE CASCADE NOT NULL, 
     timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );  

 DROP TABLE IF EXISTS links;
  CREATE TABLE links(
     id SERIAL PRIMARY KEY,
     link TEXT NOT NULL, 
     public BOOLEAN, 
     timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );   

