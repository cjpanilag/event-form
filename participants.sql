CREATE TABLE participants (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    UNIQUE (name, email)
);
