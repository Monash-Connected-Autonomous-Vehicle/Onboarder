-- These allow delete team to work correctly

-- Modify OPENING table
ALTER TABLE public."OPENING"
DROP CONSTRAINT IF EXISTS OPENING_recruitment_round_id_fkey,
ADD CONSTRAINT OPENING_recruitment_round_id_fkey 
    FOREIGN KEY (recruitment_round_id) 
    REFERENCES "RECRUITMENT_ROUND" (id) 
    ON DELETE CASCADE;

-- Modify TEAM_LEAD_ASSIGNMENT table
ALTER TABLE public."TEAM_LEAD_ASSIGNMENT"
DROP CONSTRAINT IF EXISTS TEAM_LEAD_ASSIGNMENT_opening_id_fkey,
ADD CONSTRAINT TEAM_LEAD_ASSIGNMENT_opening_id_fkey 
    FOREIGN KEY (opening_id) 
    REFERENCES "OPENING" (id) 
    ON DELETE CASCADE;

-- Modify APPLICATION table
ALTER TABLE public."APPLICATION"
DROP CONSTRAINT IF EXISTS APPLICATION_opening_id_fkey,
ADD CONSTRAINT APPLICATION_opening_id_fkey 
    FOREIGN KEY (opening_id) 
    REFERENCES "OPENING" (id) 
    ON DELETE CASCADE;

-- Modify RECRUITMENT_ROUND table
ALTER TABLE public."RECRUITMENT_ROUND"
DROP CONSTRAINT IF EXISTS RECRUITMENT_ROUND_student_team_id_fkey,
ADD CONSTRAINT RECRUITMENT_ROUND_student_team_id_fkey 
    FOREIGN KEY (student_team_id) 
    REFERENCES "STUDENT_TEAM" (id) 
    ON DELETE CASCADE;

-- Modify PROFILE_TEAM_INFO table
ALTER TABLE public."PROFILE_TEAM_INFO"
DROP CONSTRAINT IF EXISTS PROFILE_TEAM_INFO_student_team_id_fkey,
ADD CONSTRAINT PROFILE_TEAM_INFO_student_team_id_fkey 
    FOREIGN KEY (student_team_id) 
    REFERENCES "STUDENT_TEAM" (id) 
    ON DELETE CASCADE;

-- Modify INTERVIEWER_ASSIGNMENT table
ALTER TABLE public."INTERVIEWER_ASSIGNMENT"
DROP CONSTRAINT IF EXISTS INTERVIEWER_ASSIGNMENT_application_id_fkey,
ADD CONSTRAINT INTERVIEWER_ASSIGNMENT_application_id_fkey 
    FOREIGN KEY (application_id) 
    REFERENCES "APPLICATION" (id) 
    ON DELETE CASCADE;