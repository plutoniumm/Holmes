-- CREATE DATABASE QUARTERMASTER;
CREATE TABLE JSONTEST(
        mov_id SERIAL PRIMARY KEY,
        data_day VARCHAR(255),
        data_type VARCHAR(255),
        record VARCHAR(255),
        release SMALLINT,
        grade REAL,
        source VARCHAR(255),
        speed VARCHAR(255),
);

INSERT INTO jsontest( data_day, data_type, record, release, grade, source, speed ) VALUES( '05/03/2021', 'Movie', 'Return to Sender', 2015, 8, 'PrimeVideo', '1.6' ) RETURNING mov_id;