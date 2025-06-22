import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Session } from "../../db/entities/session";
import { Website } from "../../db/entities/website";
import { SessionModule } from "../session/session.module";
import { WebsiteModule } from "../website/website.module";
import { WebsiteService } from "../website/website.service";
import { MetricsController } from "./metrics.controller";
import { MetricsService } from "./metrics.service";
import { Event } from "../../db/entities/event";

@Module({
	imports: [
		TypeOrmModule.forFeature([Website, Session, Event]),
		SessionModule,
		WebsiteModule,
	],
	providers: [MetricsService, WebsiteService],
	controllers: [MetricsController],
})
export class MetricsModule {}
