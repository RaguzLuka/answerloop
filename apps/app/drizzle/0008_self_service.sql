ALTER TABLE `bookings` ADD `google_event_id` text;--> statement-breakpoint
ALTER TABLE `businesses` ADD `wa_pin_enc` text;--> statement-breakpoint
ALTER TABLE `businesses` ADD `trial_ends_at` integer;--> statement-breakpoint
ALTER TABLE `businesses` ADD `calendar_token` text;--> statement-breakpoint
ALTER TABLE `businesses` ADD `google_cal_enc` text;--> statement-breakpoint
ALTER TABLE `businesses` ADD `google_cal_email` text;--> statement-breakpoint
CREATE UNIQUE INDEX `businesses_calendar_token_unique` ON `businesses` (`calendar_token`);