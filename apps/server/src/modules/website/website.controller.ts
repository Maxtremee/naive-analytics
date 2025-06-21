import { Body, Controller, Post } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { WebsiteService } from "./website.service";

const createWebsiteSchema = z.object({
	name: z.string(),
	url: z.string(),
	owner: z.string(),
});
class CreateWebsiteDto extends createZodDto(createWebsiteSchema) {}

@Controller("website")
export class WebsiteController {
	constructor(private readonly websiteService: WebsiteService) {}

	@Post("register")
	createWebsite(@Body() body: CreateWebsiteDto) {
		return this.websiteService.createWebsite(body);
	}
}
