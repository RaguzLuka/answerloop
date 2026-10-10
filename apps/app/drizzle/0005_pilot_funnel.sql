CREATE TABLE `textback_links` (
	`token` text PRIMARY KEY NOT NULL,
	`business_id` text NOT NULL,
	`call_id` text,
	`target` text NOT NULL,
	`is_test` integer DEFAULT false NOT NULL,
	`opened_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`call_id`) REFERENCES `calls`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `textback_links_business_idx` ON `textback_links` (`business_id`,`created_at`);--> statement-breakpoint
ALTER TABLE `bookings` ADD `call_id` text;--> statement-breakpoint
ALTER TABLE `chats` ADD `opened_at` integer;