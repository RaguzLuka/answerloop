CREATE TABLE `chat_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`chat_id` text NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`chat_id`) REFERENCES `chats`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `chat_messages_chat_idx` ON `chat_messages` (`chat_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `chats` (
	`id` text PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`business_id` text NOT NULL,
	`call_id` text,
	`customer_phone` text NOT NULL,
	`customer_name` text,
	`status` text DEFAULT 'open' NOT NULL,
	`booking_id` text,
	`is_test` integer DEFAULT false NOT NULL,
	`user_messages` integer DEFAULT 0 NOT NULL,
	`expires_at` integer NOT NULL,
	`last_message_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`call_id`) REFERENCES `calls`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `chats_token_unique` ON `chats` (`token`);--> statement-breakpoint
CREATE INDEX `chats_business_idx` ON `chats` (`business_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `chats_call_idx` ON `chats` (`call_id`);--> statement-breakpoint
ALTER TABLE `businesses` ADD `chat_enabled` integer DEFAULT true NOT NULL;