ALTER TABLE `businesses` ADD `message_limit` integer;--> statement-breakpoint
ALTER TABLE `businesses` ADD `allow_extra_messages` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `businesses` ADD `usage_alert` text;--> statement-breakpoint
ALTER TABLE `sms_log` ADD `channel` text DEFAULT 'sms' NOT NULL;--> statement-breakpoint
ALTER TABLE `sms_log` ADD `extra` integer DEFAULT false NOT NULL;