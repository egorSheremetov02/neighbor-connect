-- Create ENUM types
CREATE TYPE chat_type AS ENUM ('PRIVATE', 'GROUP');
CREATE TYPE privilege_type AS ENUM ('USER', 'ADMIN');

-- Create Schema if not exists
CREATE SCHEMA IF NOT EXISTS neighbour_connect;

-- Create chat table first because it is referenced by other tables
CREATE TABLE IF NOT EXISTS neighbour_connect.chat (
    chat_id SERIAL PRIMARY KEY,
    name VARCHAR(128),
    description TEXT,
    type chat_type
);

-- Then create the resident table
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
    privilege privilege_type
);

-- Now create the message table that references the chat table
CREATE TABLE IF NOT EXISTS neighbour_connect.message (
    message_id SERIAL PRIMARY KEY,
    content TEXT,
    chat_id INT REFERENCES neighbour_connect.chat(chat_id),
    creation_date TIMESTAMP
);

-- Create message_attachment table after the message table
CREATE TABLE IF NOT EXISTS neighbour_connect.message_attachment (
    attachment_id SERIAL PRIMARY KEY,
    message_id INT REFERENCES neighbour_connect.message(message_id),
    file_name TEXT,
    size INT
);

-- Create incident table
CREATE TABLE IF NOT EXISTS neighbour_connect.incident (
    incident_id SERIAL PRIMARY KEY,
    incident_date TIMESTAMP,
    title TEXT,
    description TEXT,
    creation_date TIMESTAMP
);

-- Create incident_attachment table after the incident table
CREATE TABLE IF NOT EXISTS neighbour_connect.incident_attachment (
    attachment_id SERIAL PRIMARY KEY,
    file_name TEXT,
    size INT,
    incident_id INT REFERENCES neighbour_connect.incident(incident_id)
);

-- Create product table after the resident table
CREATE TABLE IF NOT EXISTS neighbour_connect.product (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(256),
    quantity INT,
    cost INT,
    seller_id INT REFERENCES neighbour_connect.resident(resident_id)
);

-- Create event table after the resident table
CREATE TABLE IF NOT EXISTS neighbour_connect.event (
    event_id SERIAL PRIMARY KEY,
    information TEXT,
    location TEXT,
    event_date TIMESTAMP,
    creation_date TIMESTAMP,
    creator_id INT REFERENCES neighbour_connect.resident(resident_id)
);

-- Create event_to_resident table after the event and resident tables
CREATE TABLE IF NOT EXISTS neighbour_connect.event_to_resident (
    event_id INT REFERENCES neighbour_connect.event(event_id),
    resident_id INT REFERENCES neighbour_connect.resident(resident_id)
);

-- Create comment table after the incident and resident tables
CREATE TABLE IF NOT EXISTS neighbour_connect.comment (
    comment_id SERIAL PRIMARY KEY,
    creation_time TIMESTAMP,
    content TEXT,
    incident_id INT REFERENCES neighbour_connect.incident(incident_id),
    sender_id INT REFERENCES neighbour_connect.resident(resident_id)
);

-- Create chat_to_resident table after the chat and resident tables
CREATE TABLE IF NOT EXISTS neighbour_connect.chat_to_resident (
    chat_id INT REFERENCES neighbour_connect.chat(chat_id),
    resident_id INT REFERENCES neighbour_connect.resident(resident_id)
);

-- Create like table after the incident and resident tables
CREATE TABLE IF NOT EXISTS neighbour_connect.like (
    time TIMESTAMP,
    incident_id INT REFERENCES neighbour_connect.incident(incident_id),
    resident_id INT REFERENCES neighbour_connect.resident(resident_id)
);
