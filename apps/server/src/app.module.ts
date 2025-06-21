import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { APP_PIPE } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ZodValidationPipe } from "nestjs-zod";
import { QUEUES, bullBoardOptions, queueOptions } from "./common/queue";
import { EventController } from "./modules/event/event.controller";
import { EventModule } from "./modules/event/event.module";
import { EventService } from "./modules/event/event.service";
import { SessionController } from "./modules/session/session.controller";
import { SessionModule } from "./modules/session/session.module";
import { SessionService } from "./modules/session/session.service";
import { WebsiteController } from "./modules/website/website.controller";
import { WebsiteModule } from "./modules/website/website.module";
import { WebsiteService } from "./modules/website/website.service";
import { BullBoardModule } from "@bull-board/nestjs";
import { dataSourceOptions } from "./db/datasource";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot(dataSourceOptions),
		BullModule.forRoot(queueOptions),
		BullBoardModule.forRoot(bullBoardOptions),
		BullModule.registerQueue({
			name: QUEUES.SESSION,
		}),
		BullModule.registerQueue({
			name: QUEUES.EVENT,
		}),
		BullBoardModule.forFeature({
			name: QUEUES.SESSION,
			adapter: BullMQAdapter,
		}),
		BullBoardModule.forFeature({
			name: QUEUES.EVENT,
			adapter: BullMQAdapter,
		}),
		WebsiteModule,
		EventModule,
		SessionModule,
	],
	controllers: [WebsiteController, EventController, SessionController],
	providers: [
		{
			provide: APP_PIPE,
			useClass: ZodValidationPipe,
		},
		WebsiteService,
		EventService,
		SessionService,
	],
})
export class AppModule {}
