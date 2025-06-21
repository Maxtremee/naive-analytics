import crypto from "node:crypto";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Website } from "../../db/entities/website";

@Injectable()
export class WebsiteService {
	constructor(
		@InjectRepository(Website)
		private readonly websiteRepository: Repository<Website>,
	) {}

	async createWebsite(website: { name: string; url: string; owner: string }) {
		const newWebsite = this.websiteRepository.create(website);
		const apiKey = crypto.randomBytes(32).toString("hex");
		newWebsite.apiKey = apiKey;
		return await this.websiteRepository.save(newWebsite);
	}

	async getWebsiteByApiKey(apiKey: string) {
		return await this.websiteRepository.findOne({
			where: {
				apiKey,
			},
		});
	}
}
