DROP TABLE IF EXISTS users cascade;

CREATE TABLE users(
     id SERIAL PRIMARY KEY,
     first VARCHAR NOT NULL,
     last VARCHAR NOT NULL,
     email VARCHAR UNIQUE NOT NULL,
     hashed_password VARCHAR NOT NULL,
     timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 ); 