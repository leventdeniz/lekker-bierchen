CREATE TABLE `beers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`barcode` int,
	`name` varchar(255) NOT NULL,
	`brewery` int,
	`alcohol_percentage` decimal(4,1) NOT NULL,
	`label_photo` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `beers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `breweries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `breweries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`beer` int NOT NULL,
	`sweetness` int NOT NULL,
	`bitterness` int NOT NULL,
	`sourness` int NOT NULL,
	`overall_rating` int NOT NULL,
	`notes` text,
	CONSTRAINT `ratings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `beers` ADD CONSTRAINT `beers_brewery_breweries_id_fk` FOREIGN KEY (`brewery`) REFERENCES `breweries`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ratings` ADD CONSTRAINT `ratings_beer_beers_id_fk` FOREIGN KEY (`beer`) REFERENCES `beers`(`id`) ON DELETE no action ON UPDATE no action;