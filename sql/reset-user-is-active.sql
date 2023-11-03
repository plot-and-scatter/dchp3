-- Run once to reset all users to be inactive. They will be set to be active
-- when they log in.

update user set is_active = 0;
