TRUNCATE TABLE user_table;
ALTER TABLE user_table DROP COLUMN account;
ALTER TABLE user_table
ADD CONSTRAINT user_table_email_unique UNIQUE (email);