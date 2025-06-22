import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { createZodDto } from "nestjs-zod";
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { z } from "zod";
import { Session } from "../../db/entities/session";

const metricsSchema = z.object({
	averageDuration: z.number(),
	averagePages: z.number(),
	averageUniquePages: z.number(),
	totalSessions: z.number(),
	totalDuration: z.number(),
	totalPages: z.number(),
	totalUniquePages: z.number(),
	totalBounceRate: z.number(),
});

export class MetricsResponseDto extends createZodDto(metricsSchema) {}

const referrersSchema = z
	.object({
		referrer: z.string(),
		count: z.number(),
	})
	.array();

export class ReferrersResponseDto extends createZodDto(referrersSchema) {}

@Injectable()
export class MetricsService {
	constructor(
		@InjectRepository(Session)
		private readonly sessionRepository: Repository<Session>,
	) {}

	async getMetrics(
		websiteId: number,
		query: { before?: Date; after?: Date },
	): Promise<MetricsResponseDto> {
		const sessions = await this.sessionRepository.find({
			where: {
				website: {
					id: websiteId,
				},
				enteredAt: this.parseBetween(query),
			},
		});

		const averageDuration =
			sessions
				.filter((session) => session.duration)
				.reduce((acc, session) => acc + session.duration!, 0) / sessions.length;

		const totalSessions = sessions.length;

		const totalDuration = sessions
			.filter((session) => session.duration)
			.reduce((acc, session) => acc + session.duration!, 0);

		const totalPages = sessions
			.filter((session) => session.path)
			.reduce((acc, session) => acc + session.path!.length, 0);

		const averagePages = totalPages / totalSessions;

		const totalUniquePages = new Set(
			sessions.flatMap((session) => session.path),
		).size;

		const averageUniquePages = totalUniquePages / totalSessions;

		const totalBounceRate =
			sessions.filter((session) => session.path?.length === 1).length /
			totalSessions;

		return {
			averageDuration,
			averagePages,
			averageUniquePages,
			totalSessions,
			totalDuration,
			totalPages,
			totalUniquePages,
			totalBounceRate,
		};
	}

	async getReferrers(
		websiteId: number,
		query: { before?: Date; after?: Date },
	): Promise<ReferrersResponseDto> {
		const sessions = await this.sessionRepository.find({
			where: {
				website: {
					id: websiteId,
				},
				enteredAt: this.parseBetween(query),
			},
		});

		const referrers = new Map<string, number>();

		sessions.forEach((session) => {
			if (session.referrer) {
				referrers.set(
					session.referrer,
					(referrers.get(session.referrer) || 0) + 1,
				);
			}
		});

		return Array.from(referrers.entries()).map(([referrer, count]) => ({
			referrer,
			count,
		}));
	}

	private parseBetween(query: { before?: Date; after?: Date }) {
		if (query.before && query.after) {
			return Between(query.before, query.after);
		}
		if (query.before) {
			return LessThanOrEqual(query.before);
		}
		if (query.after) {
			return MoreThanOrEqual(query.after);
		}
	}
}
