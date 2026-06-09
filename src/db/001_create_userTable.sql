CREATE TABLE IF NOT EXISTS user_table (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    user_name TEXT NOT NULL
)
SELECT *
FROM user_table