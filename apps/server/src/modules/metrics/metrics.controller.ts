import {
	Controller,
	Get,
	Inject,
	NotFoundException,
	Param,
	Query,
} from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { WebsiteService } from "../website/website.service";
import {
	MetricsResponseDto,
	MetricsService,
	ReferrersResponseDto,
} from "./metrics.service";

const metricsQueryParams = z.object({
	before: z.coerce.date().optional(),
	after: z.coerce.date().optional(),
});
class MetricsQueryParams extends createZodDto(metricsQueryParams) {}

@Controller("metrics")
export class MetricsController {
	constructor(
		@Inject(MetricsService) private readonly metricsService: MetricsService,
		@Inject(WebsiteService) private readonly websiteService: WebsiteService,
	) {}

	@Get("/:apiKey")
	@ApiOkResponse({ type: MetricsResponseDto })
	async getMetrics(
		@Param("apiKey") apiKey: string,
		@Query() query: MetricsQueryParams,
	) {
		const website = await this.websiteService.getWebsiteByApiKey(apiKey);
		if (!website) {
			throw new NotFoundException("Website not found");
		}
		return this.metricsService.getMetrics(website.id, query);
	}

	@Get("/:apiKey/referrers")
	@ApiOkResponse({ type: ReferrersResponseDto })
	async getReferrers(
		@Param("apiKey") apiKey: string,
		@Query() query: MetricsQueryParams,
	) {
		const website = await this.websiteService.getWebsiteByApiKey(apiKey);
		if (!website) {
			throw new NotFoundException("Website not found");
		}
		return this.metricsService.getReferrers(website.id, query);
	}
}
