import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { BullBoardModule } from "@bull-board/nestjs";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QUEUES } from "../../common/queue";
import { Event } from "../../db/entities/event";
import { Session } from "../../db/entities/session";
import { EventConsumer } from "./event.consumer";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { SessionModule } from "../session/session.module";
import { SessionService } from "../session/session.service";
import { WebsiteModule } from "../website/website.module";
import { WebsiteService } from "../website/website.service";
import { Website } from "../../db/entities/website";

@Module({
	imports: [
		TypeOrmModule.forFeature([Event, Session, Website]),
		BullModule.registerQueue({
			name: QUEUES.EVENT,
		}),
		BullBoardModule.forFeature({
			name: QUEUES.EVENT,
			adapter: BullMQAdapter,
		}),
		SessionModule,
		WebsiteModule,
	],
	controllers: [EventController],
	providers: [EventService, EventConsumer, SessionService, WebsiteService],
})
export class EventModule {}
