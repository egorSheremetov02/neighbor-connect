-- Create Schema if not exists
CREATE SCHEMA IF NOT EXISTS neighbour_connect;

-- Create message table
CREATE TABLE IF NOT EXISTS neighbour_connect.message (
    message_id SERIAL PRIMARY KEY,
    content TEXT,
    chat_id INT REFERENCES neighbour_connect.chat(chat_id),
    creation_date TIMESTAMP
);

-- Create message_attachment table
CREATE TABLE IF NOT EXISTS neighbour_connect.message_attachment (
    attachment_id SERIAL PRIMARY KEY,
    message_id INT REFERENCES neighbour_connect.message(message_id),
    file_name TEXT,
    size INT
);

-- Create chat table
CREATE TABLE IF NOT EXISTS neighbour_connect.chat (
    chat_id SERIAL PRIMARY KEY,
    name VARCHAR(128),
    description TEXT,
    type ENUM ('PRIVATE', 'GROUP')
);

-- Create chat_to_resident table
CREATE TABLE IF NOT EXISTS neighbour_connect.chat_to_resident (
    chat_id INT REFERENCES neighbour_connect.chat(chat_id),
    resident_id INT REFERENCES neighbour_connect.resident(resident_id)
);

-- Create resident table
CREATE TABLE IF NOT EXISTS neighbour_connect.resident (
    resident_id SERIAL PRIMARY KEY,
    first_name VARCHAR(128),
    second_name VARCHAR(128),
    birthday TIMESTAMP,
    profile_pic_url TEXT,
    address TEXT,
    phone_number TEXT,
    bio TEXT,
    email TEXT,
    password_hash TEXT,
    password_salt TEXT,
    privilege ENUM ('USER', 'ADMIN')
);

-- Create incident table
CREATE TABLE IF NOT EXISTS neighbour_connect.incident (
    incident_id SERIAL PRIMARY KEY,
    incident_date TIMESTAMP,
    title TEXT,
    description TEXT,
    creation_date TIMESTAMP
);

-- Create incident_attachment table
CREATE TABLE IF NOT EXISTS neighbour_connect.incident_attachment (
    attachment_id SERIAL PRIMARY KEY,
    file_name TEXT,
    size INT,
    incident_id INT REFERENCES neighbour_connect.incident(incident_id)
);

-- Create like table
CREATE TABLE IF NOT EXISTS neighbour_connect.like (
    time TIMESTAMP,
    incident_id INT REFERENCES neighbour_connect.incident(incident_id),
    resident_id INT REFERENCES neighbour_connect.resident(resident_id)
);

-- Create product table
CREATE TABLE IF NOT EXISTS neighbour_connect.product (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(256),
    quantity INT,
    cost INT,
    seller_id INT REFERENCES neighbour_connect.resident(resident_id)
);

-- Create event table
CREATE TABLE IF NOT EXISTS neighbour_connect.event (
    event_id SERIAL PRIMARY KEY,
    information TEXT,
    location TEXT,
    event_date TIMESTAMP,
    creation_date TIMESTAMP,
    creator_id INT REFERENCES neighbour_connect.resident(resident_id)
);

-- Create event_to_resident table
CREATE TABLE IF NOT EXISTS neighbour_connect.event_to_resident (
    event_id INT REFERENCES neighbour_connect.event(event_id),
    resident_id INT REFERENCES neighbour_connect.resident(resident_id)
);

-- Create comment table
CREATE TABLE IF NOT EXISTS neighbour_connect.comment (
    comment_id SERIAL PRIMARY KEY,
    creation_time TIMESTAMP,
    content TEXT,
    incident_id INT REFERENCES neighbour_connect.incident(incident_id),
    sender_id INT REFERENCES neighbour_connect.resident(resident_id)
);
