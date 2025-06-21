import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Website } from "../../db/entities/website";
import { WebsiteController } from "./website.controller";
import { WebsiteService } from "./website.service";

@Module({
	imports: [TypeOrmModule.forFeature([Website])],
	providers: [WebsiteService],
	controllers: [WebsiteController],
})
export class WebsiteModule {}
