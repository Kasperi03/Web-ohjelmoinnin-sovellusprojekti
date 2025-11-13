-- ==========================================
-- PostgreSQL Database Schema (Final)
-- ==========================================

-- Drop existing tables (in correct order to avoid FK conflicts)
DROP TABLE IF EXISTS group_movies CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
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
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

-- ==========================================
-- Table: groups
-- ==========================================
CREATE TABLE groups (
    group_id SERIAL PRIMARY KEY,
    owner_id INT NOT NULL 
        REFERENCES account(account_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL
);

-- ==========================================
-- Table: group_members
-- ==========================================
CREATE TABLE group_members (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL 
        REFERENCES groups(group_id) ON DELETE CASCADE,
    account_id INT NOT NULL 
        REFERENCES account(account_id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'accepted', 'rejected')),
    UNIQUE (group_id, account_id)
);

-- ==========================================
-- Table: movies
-- ==========================================
CREATE TABLE movies (
    movie_id SERIAL PRIMARY KEY,
    api_id VARCHAR(100) UNIQUE NOT NULL
);

-- ==========================================
-- Table: favorites
-- ==========================================
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    account_id INT NOT NULL 
        REFERENCES account(account_id) ON DELETE CASCADE,
    movie_id INT NOT NULL 
        REFERENCES movies(movie_id) ON DELETE CASCADE,
    UNIQUE (account_id, movie_id)
);

-- ==========================================
-- Table: group_movies
-- ==========================================
CREATE TABLE group_movies (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL 
        REFERENCES groups(group_id) ON DELETE CASCADE,
    movie_id INT NOT NULL 
        REFERENCES movies(movie_id) ON DELETE CASCADE,
    UNIQUE (group_id, movie_id)
);

-- ==========================================
-- Table: reviews
-- ==========================================
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,

    account_id INT NOT NULL 
        REFERENCES account(account_id) ON DELETE CASCADE,

    movie_id INT NOT NULL 
        REFERENCES movies(movie_id) ON DELETE CASCADE,

    rating INT NOT NULL 
        CHECK (rating BETWEEN 0 AND 5),

    review_text TEXT,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE (account_id, movie_id)   -- 1 review per user per movie
);
