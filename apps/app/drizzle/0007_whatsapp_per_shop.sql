ALTER TABLE `businesses` ADD `wa_phone_number_id` text;--> statement-breakpoint
ALTER TABLE `businesses` ADD `wa_business_account_id` text;--> statement-breakpoint
ALTER TABLE `businesses` ADD `wa_display_phone` text;--> statement-breakpoint
ALTER TABLE `businesses` ADD `wa_token_enc` text;--> statement-breakpoint
ALTER TABLE `businesses` ADD `wa_own_app` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `businesses` ADD `wa_templates_at` integer;--> statement-breakpoint
CREATE UNIQUE INDEX `businesses_wa_phone_number_id_unique` ON `businesses` (`wa_phone_number_id`);