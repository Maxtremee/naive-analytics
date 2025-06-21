import { Module } from "@nestjs/common";
import { WebsiteController } from "./website.controller";
import { WebsiteService } from "./website.service";

@Module({
	providers: [WebsiteService],
	controllers: [WebsiteController],
})
export class WebsiteModule {}
