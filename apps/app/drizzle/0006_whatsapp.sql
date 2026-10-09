ALTER TABLE `businesses` ADD `whatsapp_enabled` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `calls` ADD `channel` text DEFAULT 'sms' NOT NULL;--> statement-breakpoint
ALTER TABLE `chat_messages` ADD `wa_id` text;--> statement-breakpoint
CREATE UNIQUE INDEX `chat_messages_wa_id_unique` ON `chat_messages` (`wa_id`);--> statement-breakpoint
ALTER TABLE `chats` ADD `channel` text DEFAULT 'web' NOT NULL;--> statement-breakpoint
ALTER TABLE `chats` ADD `owner_took_over_at` integer;--> statement-breakpoint
ALTER TABLE `chats` ADD `sms_fallback_at` integer;