CREATE TABLE `calls` (
	`id` text PRIMARY KEY NOT NULL,
	`business_id` text NOT NULL,
	`call_sid` text NOT NULL,
	`caller_phone` text,
	`outcome` text NOT NULL,
	`error` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `calls_call_sid_unique` ON `calls` (`call_sid`);--> statement-breakpoint
CREATE INDEX `calls_business_time_idx` ON `calls` (`business_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `phone_numbers` (
	`number` text PRIMARY KEY NOT NULL,
	`business_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `push_subscriptions` (
	`endpoint` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`p256dh` text NOT NULL,
	`auth` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `push_user_idx` ON `push_subscriptions` (`user_id`);--> statement-breakpoint
CREATE TABLE `sms_log` (
	`id` text PRIMARY KEY NOT NULL,
	`business_id` text NOT NULL,
	`kind` text NOT NULL,
	`to_phone` text NOT NULL,
	`sid` text,
	`error` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `sms_business_time_idx` ON `sms_log` (`business_id`,`created_at`);--> statement-breakpoint
ALTER TABLE `bookings` ADD `confirmation_sent_at` integer;--> statement-breakpoint
ALTER TABLE `bookings` ADD `reminder_sent_at` integer;--> statement-breakpoint
ALTER TABLE `businesses` ADD `sms_language` text DEFAULT 'hr' NOT NULL;--> statement-breakpoint
ALTER TABLE `businesses` ADD `confirmations_enabled` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `businesses` ADD `reminders_enabled` integer DEFAULT true NOT NULL;