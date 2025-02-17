-- First, make user_email nullable to prevent issues with existing data
ALTER TABLE requests MODIFY COLUMN user_email VARCHAR(255) NULL;

-- Add the new user_id column
ALTER TABLE requests ADD COLUMN user_id BIGINT NULL;

-- Update any existing records if needed (you can skip this if the table is empty)
-- UPDATE requests SET user_id = 1 WHERE user_id IS NULL;

-- Make user_id NOT NULL after data is migrated
ALTER TABLE requests MODIFY COLUMN user_id BIGINT NOT NULL;

-- Finally, drop the user_email column
ALTER TABLE requests DROP COLUMN user_email;
