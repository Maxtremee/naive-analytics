import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { BullBoardModule } from "@bull-board/nestjs";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QUEUES } from "../../common/queue";
import { Session } from "../../db/entities/session";
import { SessionConsumer } from "./session.consumer";
import { SessionController } from "./session.controller";
import { SessionService } from "./session.service";
import { WebsiteModule } from "../website/website.module";
import { WebsiteService } from "../website/website.service";
import { Website } from "../../db/entities/website";

@Module({
	imports: [
		TypeOrmModule.forFeature([Session, Website]),
		BullModule.registerQueue({
			name: QUEUES.SESSION,
		}),
		BullBoardModule.forFeature({
			name: QUEUES.SESSION,
			adapter: BullMQAdapter,
		}),
		WebsiteModule,
	],
	providers: [SessionService, SessionConsumer, WebsiteService],
	controllers: [SessionController],
})
export class SessionModule {}
