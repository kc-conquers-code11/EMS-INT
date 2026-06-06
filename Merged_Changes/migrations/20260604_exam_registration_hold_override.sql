-- Allow COE to clear hall ticket hold so a student may download again
ALTER TABLE `exam_registration`
  ADD COLUMN `hall_ticket_hold_override` tinyint(1) NOT NULL DEFAULT 0;
