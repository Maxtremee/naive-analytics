import { BullBoardModule } from "@bull-board/nestjs";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ZodValidationPipe } from "nestjs-zod";
import { bullBoardOptions, queueOptions } from "./common/queue";
import { dataSourceOptions } from "./db/datasource";
import { EventModule } from "./modules/event/event.module";
import { MetricsModule } from "./modules/metrics/metrics.module";
import { SessionModule } from "./modules/session/session.module";
import { WebsiteModule } from "./modules/website/website.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot(dataSourceOptions),
		BullModule.forRoot(queueOptions),
		BullBoardModule.forRoot(bullBoardOptions),
		WebsiteModule,
		EventModule,
		SessionModule,
		MetricsModule,
	],
	providers: [
		{
			provide: APP_PIPE,
			useClass: ZodValidationPipe,
		},
	],
})
export class AppModule {}
