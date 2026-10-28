CREATE DATABASE IF NOT EXISTS evcharge_db;
USE evcharge_db;

CREATE TABLE IF NOT EXISTS stations (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    location VARCHAR(255),
    total_chargers INT NOT NULL DEFAULT 0,
    available_chargers INT NOT NULL DEFAULT 0,
    price_per_kwh DOUBLE NOT NULL DEFAULT 0
);

INSERT INTO stations
    (name, location, total_chargers, available_chargers, price_per_kwh)
SELECT 'Central EV Hub', 'Hyderabad Central', 8, 6, 12.50
WHERE NOT EXISTS (
    SELECT 1 FROM stations WHERE name = 'Central EV Hub'
);

INSERT INTO stations
    (name, location, total_chargers, available_chargers, price_per_kwh)
SELECT 'Tech Park Charging', 'HITEC City', 10, 7, 13.00
WHERE NOT EXISTS (
    SELECT 1 FROM stations WHERE name = 'Tech Park Charging'
);

INSERT INTO stations
    (name, location, total_chargers, available_chargers, price_per_kwh)
SELECT 'Airport Fast Charge', 'Rajiv Gandhi International Airport', 6, 4, 14.50
WHERE NOT EXISTS (
    SELECT 1 FROM stations WHERE name = 'Airport Fast Charge'
);

INSERT INTO stations
    (name, location, total_chargers, available_chargers, price_per_kwh)
SELECT 'Green Park Station', 'Gachibowli', 5, 3, 11.75
WHERE NOT EXISTS (
    SELECT 1 FROM stations WHERE name = 'Green Park Station'
);