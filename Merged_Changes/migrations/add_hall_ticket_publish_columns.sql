-- Run once: BullMQ publish tracking on hall_ticket_settings
ALTER TABLE hall_ticket_settings
  ADD COLUMN published_at DATETIME NULL;

ALTER TABLE hall_ticket_settings
  ADD COLUMN scheduled_publish_at DATETIME NULL;
