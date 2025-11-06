-- ==========================================
-- PostgreSQL Database Schema
-- ==========================================

-- Drop existing tables (in correct order to avoid FK conflicts)
DROP TABLE IF EXISTS group_movies CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS group_members CASCADE;
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS account CASCADE;

-- ==========================================
-- Table: account
-- ==========================================
CREATE TABLE account (
    account_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

-- ==========================================
-- Table: groups
-- ==========================================
CREATE TABLE groups (
    group_id SERIAL PRIMARY KEY,
    owner_id INT NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL
);

-- ==========================================
-- Table: group_members
-- ==========================================
CREATE TABLE group_members (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL REFERENCES groups(group_id) ON DELETE CASCADE,
    account_id INT NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
    UNIQUE (group_id, account_id)
);

-- ==========================================
-- Table: movies
-- ==========================================
CREATE TABLE movies (
    movie_id SERIAL PRIMARY KEY,
    api_id VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    poster_url TEXT,
    rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 10)
);

-- ==========================================
-- Table: favorites
-- ==========================================
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    account_id INT NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
    movie_id INT NOT NULL REFERENCES movies(movie_id) ON DELETE CASCADE,
    UNIQUE (account_id, movie_id)
);

-- ==========================================
-- Table: group_movies
-- ==========================================
CREATE TABLE group_movies (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL REFERENCES groups(group_id) ON DELETE CASCADE,
    movie_id INT NOT NULL REFERENCES movies(movie_id) ON DELETE CASCADE,
    UNIQUE (group_id, movie_id)
);
