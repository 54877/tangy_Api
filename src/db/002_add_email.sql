ALTER TABLE user_table
ADD COLUMN email TEXT;
UPDATE user_table
SET email = '**********@gmail.com'
WHERE email IS NULL;
ALTER TABLE user_table
ALTER COLUMN email
SET NOT NULL;