CREATE TABLE IF NOT EXISTS `drinking_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`drink` int NOT NULL,
	`rating` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `drinking_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `drinks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`barcode` int,
	`name` varchar(255) NOT NULL,
	`brewery` int,
	`alcohol_percentage` decimal(4,1),
	`label_photo` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `drinks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
-- ALTER TABLE `ratings` DROP FOREIGN KEY `ratings_beer_beers_id_fk`;
-- DROP TABLE `beers`;--> statement-breakpoint
--> statement-breakpoint
-- ALTER TABLE `drinking_logs` ADD CONSTRAINT `drinking_logs_drink_drinks_id_fk` FOREIGN KEY (`drink`) REFERENCES `drinks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE `drinking_logs` ADD CONSTRAINT `drinking_logs_rating_ratings_id_fk` FOREIGN KEY (`rating`) REFERENCES `ratings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE `drinks` ADD CONSTRAINT `drinks_brewery_breweries_id_fk` FOREIGN KEY (`brewery`) REFERENCES `breweries`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE `ratings` ADD CONSTRAINT `ratings_beer_drinks_id_fk` FOREIGN KEY (`beer`) REFERENCES `drinks`(`id`) ON DELETE no action ON UPDATE no action;
