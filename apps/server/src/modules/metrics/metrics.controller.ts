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
	DeviceAnalyticsResponseDto,
	GeographicAnalyticsResponseDto,
	PageAnalyticsResponseDto,
	RealTimeResponseDto,
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

	@Get("/:apiKey/device-analytics")
	@ApiOkResponse({ type: DeviceAnalyticsResponseDto })
	async getDeviceAnalytics(
		@Param("apiKey") apiKey: string,
		@Query() query: MetricsQueryParams,
	) {
		const website = await this.websiteService.getWebsiteByApiKey(apiKey);
		if (!website) {
			throw new NotFoundException("Website not found");
		}
		return this.metricsService.getDeviceAnalytics(website.id, query);
	}

	@Get("/:apiKey/geographic-analytics")
	@ApiOkResponse({ type: GeographicAnalyticsResponseDto })
	async getGeographicAnalytics(
		@Param("apiKey") apiKey: string,
		@Query() query: MetricsQueryParams,
	) {
		const website = await this.websiteService.getWebsiteByApiKey(apiKey);
		if (!website) {
			throw new NotFoundException("Website not found");
		}
		return this.metricsService.getGeographicAnalytics(website.id, query);
	}

	@Get("/:apiKey/page-analytics")
	@ApiOkResponse({ type: PageAnalyticsResponseDto })
	async getPageAnalytics(
		@Param("apiKey") apiKey: string,
		@Query() query: MetricsQueryParams,
	) {
		const website = await this.websiteService.getWebsiteByApiKey(apiKey);
		if (!website) {
			throw new NotFoundException("Website not found");
		}
		return this.metricsService.getPageAnalytics(website.id, query);
	}

	@Get("/:apiKey/real-time")
	@ApiOkResponse({ type: RealTimeResponseDto })
	async getRealTimeMetrics(
		@Param("apiKey") apiKey: string,
	) {
		const website = await this.websiteService.getWebsiteByApiKey(apiKey);
		if (!website) {
			throw new NotFoundException("Website not found");
		}
		return this.metricsService.getRealTimeMetrics(website.id);
	}
}
