import { ConfigService } from "@nestjs/config";
import "dotenv/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { Event } from "./entities/event";
import { Session } from "./entities/session";
import { Website } from "./entities/website";

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
	type: "postgres",
	host: configService.getOrThrow<string>("POSTGRES_HOST"),
	port: configService.getOrThrow<number>("POSTGRES_PORT"),
	username: configService.getOrThrow<string>("POSTGRES_USER"),
	password: configService.getOrThrow<string>("POSTGRES_PASSWORD"),
	database: configService.getOrThrow<string>("POSTGRES_DB"),
	entities: [Event, Session, Website],
	synchronize: configService.get<string>("DB_SYNC") === "true",
};

export const dataSource = new DataSource(dataSourceOptions);
