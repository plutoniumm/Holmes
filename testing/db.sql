CREATE DATABASE QUARTERMASTER;
CREATE TABLE MOVIES(
        mov_id SERIAL PRIMARY KEY,

        mov_type VARCHAR(255),
        source VARCHAR(255)
