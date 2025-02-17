-- Drop the user_email column and add user_id column
ALTER TABLE requests 
DROP COLUMN user_email,
ADD COLUMN user_id BIGINT NOT NULL;
