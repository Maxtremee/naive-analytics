import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { createZodDto } from "nestjs-zod";
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { z } from "zod";
import { Session } from "../../db/entities/session";
import { Event } from "../../db/entities/event";
import { EventType } from "../event/event-type";

const metricsSchema = z.object({
	// Basic metrics
	averageDuration: z.number(),
	averagePages: z.number(),
	averageUniquePages: z.number(),
	totalSessions: z.number(),
	totalDuration: z.number(),
	totalPages: z.number(),
	totalUniquePages: z.number(),
	totalBounceRate: z.number(),
	
	// Engagement metrics
	averageScrollDepth: z.number(),
	averageTimeOnPage: z.number(),
	totalClicks: z.number(),
	totalViews: z.number(),
	engagementRate: z.number(),
	
	// Device analytics
	deviceBreakdown: z.object({
		desktop: z.number(),
		mobile: z.number(),
		tablet: z.number(),
	}),
	browserBreakdown: z.object({
		browser: z.string(),
		count: z.number(),
		percentage: z.number(),
	}).array(),
	
	// Geographic analytics
	topCountries: z.object({
		country: z.string(),
		count: z.number(),
		percentage: z.number(),
	}).array(),
	
	// Page analytics
	topPages: z.object({
		page: z.string(),
		views: z.number(),
		uniqueViews: z.number(),
		averageTimeOnPage: z.number(),
		bounceRate: z.number(),
	}).array(),
	
	// Time-based analytics
	hourlyDistribution: z.object({
		hour: z.number(),
		sessions: z.number(),
	}).array(),
	dailyDistribution: z.object({
		day: z.string(),
		sessions: z.number(),
	}).array(),
	
	// Real-time metrics
	activeUsers: z.number(),
	currentSessions: z.number(),
	
	// Performance metrics
	averagePageLoadTime: z.number(),
	slowPages: z.object({
		page: z.string(),
		avgLoadTime: z.number(),
	}).array(),
	
	// Conversion metrics
	conversionRate: z.number(),
	goalCompletions: z.number(),
});

export class MetricsResponseDto extends createZodDto(metricsSchema) {}

const referrersSchema = z
	.object({
		referrer: z.string(),
		count: z.number(),
		percentage: z.number(),
	})
	.array();

export class ReferrersResponseDto extends createZodDto(referrersSchema) {}

const deviceAnalyticsSchema = z.object({
	deviceBreakdown: z.object({
		desktop: z.number(),
		mobile: z.number(),
		tablet: z.number(),
	}),
	browserBreakdown: z.object({
		browser: z.string(),
		count: z.number(),
		percentage: z.number(),
	}).array(),
	osBreakdown: z.object({
		os: z.string(),
		count: z.number(),
		percentage: z.number(),
	}).array(),
});

export class DeviceAnalyticsResponseDto extends createZodDto(deviceAnalyticsSchema) {}

const geographicAnalyticsSchema = z.object({
	topCountries: z.object({
		country: z.string(),
		count: z.number(),
		percentage: z.number(),
	}).array(),
	topCities: z.object({
		city: z.string(),
		country: z.string(),
		count: z.number(),
		percentage: z.number(),
	}).array(),
});

export class GeographicAnalyticsResponseDto extends createZodDto(geographicAnalyticsSchema) {}

const pageAnalyticsSchema = z.object({
	topPages: z.object({
		page: z.string(),
		views: z.number(),
		uniqueViews: z.number(),
		averageTimeOnPage: z.number(),
		bounceRate: z.number(),
		avgScrollDepth: z.number(),
	}).array(),
	pageFlow: z.object({
		from: z.string(),
		to: z.string(),
		count: z.number(),
	}).array(),
});

export class PageAnalyticsResponseDto extends createZodDto(pageAnalyticsSchema) {}

const realTimeSchema = z.object({
	activeUsers: z.number(),
	currentSessions: z.number(),
	recentActivity: z.object({
		timestamp: z.date(),
		action: z.string(),
		page: z.string(),
		userAgent: z.string(),
	}).array(),
});

export class RealTimeResponseDto extends createZodDto(realTimeSchema) {}

@Injectable()
export class MetricsService {
	constructor(
		@InjectRepository(Session)
		private readonly sessionRepository: Repository<Session>,
		@InjectRepository(Event)
		private readonly eventRepository: Repository<Event>,
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
			relations: ['events'],
		});

		const events = await this.eventRepository.find({
			where: {
				session: {
					website: {
						id: websiteId,
					},
					enteredAt: this.parseBetween(query),
				},
			},
		});

		// Basic metrics
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

		// Engagement metrics
		const scrollEvents = events.filter(event => event.type === EventType.SCROLL);
		const averageScrollDepth = scrollEvents.length > 0 
			? scrollEvents.reduce((acc, event) => acc + (event.data.scrollDepth as number || 0), 0) / scrollEvents.length
			: 0;

		const clickEvents = events.filter(event => event.type === EventType.CLICK || event.type === EventType.CLICK_LINK);
		const totalClicks = clickEvents.length;

		const viewEvents = events.filter(event => event.type === EventType.VIEW);
		const totalViews = viewEvents.length;

		const averageTimeOnPage = totalViews > 0 
			? events.reduce((acc, event) => acc + (event.data.timeOnPage as number || 0), 0) / totalViews
			: 0;

		const engagementRate = totalSessions > 0 
			? (sessions.filter(session => session.duration && session.duration > 30).length / totalSessions) * 100
			: 0;

		// Device analytics
		const deviceBreakdown = this.getDeviceBreakdown(sessions);
		const browserBreakdown = this.getBrowserBreakdown(sessions);

		// Geographic analytics
		const topCountries = this.getTopCountries(sessions);

		// Page analytics
		const topPages = this.getTopPages(sessions, events);

		// Time-based analytics
		const hourlyDistribution = this.getHourlyDistribution(sessions);
		const dailyDistribution = this.getDailyDistribution(sessions);

		// Real-time metrics (last 5 minutes)
		const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
		const activeUsers = sessions.filter(session => 
			session.enteredAt && session.enteredAt > fiveMinutesAgo
		).length;

		const currentSessions = sessions.filter(session => 
			!session.exitedAt || session.exitedAt > fiveMinutesAgo
		).length;

		// Performance metrics
		const averagePageLoadTime = viewEvents.length > 0
			? viewEvents.reduce((acc, event) => acc + (event.data.loadTime as number || 0), 0) / viewEvents.length
			: 0;

		const slowPages = this.getSlowPages(viewEvents);

		// Conversion metrics (placeholder - would need goal configuration)
		const conversionRate = 0; // Would be calculated based on defined goals
		const goalCompletions = 0; // Would be calculated based on defined goals

		return {
			averageDuration,
			averagePages,
			averageUniquePages,
			totalSessions,
			totalDuration,
			totalPages,
			totalUniquePages,
			totalBounceRate,
			averageScrollDepth,
			averageTimeOnPage,
			totalClicks,
			totalViews,
			engagementRate,
			deviceBreakdown,
			browserBreakdown,
			topCountries,
			topPages,
			hourlyDistribution,
			dailyDistribution,
			activeUsers,
			currentSessions,
			averagePageLoadTime,
			slowPages,
			conversionRate,
			goalCompletions,
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

		const totalSessions = sessions.length;
		const referrersArray = Array.from(referrers.entries()).map(([referrer, count]) => ({
			referrer,
			count,
			percentage: totalSessions > 0 ? (count / totalSessions) * 100 : 0,
		}));

		return referrersArray.sort((a, b) => b.count - a.count);
	}

	async getDeviceAnalytics(
		websiteId: number,
		query: { before?: Date; after?: Date },
	): Promise<DeviceAnalyticsResponseDto> {
		const sessions = await this.sessionRepository.find({
			where: {
				website: {
					id: websiteId,
				},
				enteredAt: this.parseBetween(query),
			},
		});

		const deviceBreakdown = this.getDeviceBreakdown(sessions);
		const browserBreakdown = this.getBrowserBreakdown(sessions);
		const osBreakdown = this.getOSBreakdown(sessions);

		return {
			deviceBreakdown,
			browserBreakdown,
			osBreakdown,
		};
	}

	async getGeographicAnalytics(
		websiteId: number,
		query: { before?: Date; after?: Date },
	): Promise<GeographicAnalyticsResponseDto> {
		const sessions = await this.sessionRepository.find({
			where: {
				website: {
					id: websiteId,
				},
				enteredAt: this.parseBetween(query),
			},
		});

		const topCountries = this.getTopCountries(sessions);
		const topCities = this.getTopCities(sessions);

		return {
			topCountries,
			topCities,
		};
	}

	async getPageAnalytics(
		websiteId: number,
		query: { before?: Date; after?: Date },
	): Promise<PageAnalyticsResponseDto> {
		const sessions = await this.sessionRepository.find({
			where: {
				website: {
					id: websiteId,
				},
				enteredAt: this.parseBetween(query),
			},
			relations: ['events'],
		});

		const events = await this.eventRepository.find({
			where: {
				session: {
					website: {
						id: websiteId,
					},
					enteredAt: this.parseBetween(query),
				},
			},
		});

		const topPages = this.getTopPages(sessions, events);
		const pageFlow = this.getPageFlow(sessions);

		return {
			topPages,
			pageFlow,
		};
	}

	async getRealTimeMetrics(
		websiteId: number,
	): Promise<RealTimeResponseDto> {
		const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
		
		const recentSessions = await this.sessionRepository.find({
			where: {
				website: {
					id: websiteId,
				},
				enteredAt: MoreThanOrEqual(fiveMinutesAgo),
			},
			relations: ['events'],
		});

		const activeUsers = recentSessions.length;
		const currentSessions = recentSessions.filter(session => 
			!session.exitedAt || session.exitedAt > fiveMinutesAgo
		).length;

		const recentActivity = recentSessions
			.flatMap(session => session.events)
			.sort((a, b) => new Date(b.data.timestamp as string).getTime() - new Date(a.data.timestamp as string).getTime())
			.slice(0, 10)
			.map(event => ({
				timestamp: new Date(event.data.timestamp as string),
				action: event.type,
				page: event.data.page as string || 'Unknown',
				userAgent: event.data.userAgent as string || 'Unknown',
			}));

		return {
			activeUsers,
			currentSessions,
			recentActivity,
		};
	}

	private getDeviceBreakdown(sessions: Session[]) {
		const deviceCounts = { desktop: 0, mobile: 0, tablet: 0 };
		
		sessions.forEach(session => {
			if (session.userAgent) {
				const ua = session.userAgent.toLowerCase();
				if (ua.includes('mobile') && !ua.includes('tablet')) {
					deviceCounts.mobile++;
				} else if (ua.includes('tablet') || ua.includes('ipad')) {
					deviceCounts.tablet++;
				} else {
					deviceCounts.desktop++;
				}
			} else {
				deviceCounts.desktop++;
			}
		});

		return deviceCounts;
	}

	private getBrowserBreakdown(sessions: Session[]) {
		const browserCounts = new Map<string, number>();
		
		sessions.forEach(session => {
			if (session.userAgent) {
				const ua = session.userAgent.toLowerCase();
				let browser = 'Unknown';
				
				if (ua.includes('chrome')) browser = 'Chrome';
				else if (ua.includes('firefox')) browser = 'Firefox';
				else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
				else if (ua.includes('edge')) browser = 'Edge';
				else if (ua.includes('opera')) browser = 'Opera';
				
				browserCounts.set(browser, (browserCounts.get(browser) || 0) + 1);
			}
		});

		const total = sessions.length;
		return Array.from(browserCounts.entries()).map(([browser, count]) => ({
			browser,
			count,
			percentage: total > 0 ? (count / total) * 100 : 0,
		})).sort((a, b) => b.count - a.count);
	}

	private getOSBreakdown(sessions: Session[]) {
		const osCounts = new Map<string, number>();
		
		sessions.forEach(session => {
			if (session.userAgent) {
				const ua = session.userAgent.toLowerCase();
				let os = 'Unknown';
				
				if (ua.includes('windows')) os = 'Windows';
				else if (ua.includes('mac os')) os = 'macOS';
				else if (ua.includes('linux')) os = 'Linux';
				else if (ua.includes('android')) os = 'Android';
				else if (ua.includes('ios')) os = 'iOS';
				
				osCounts.set(os, (osCounts.get(os) || 0) + 1);
			}
		});

		const total = sessions.length;
		return Array.from(osCounts.entries()).map(([os, count]) => ({
			os,
			count,
			percentage: total > 0 ? (count / total) * 100 : 0,
		})).sort((a, b) => b.count - a.count);
	}

	private getTopCountries(sessions: Session[]) {
		const countryCounts = new Map<string, number>();
		
		sessions.forEach(session => {
			// This is a simplified implementation
			// In a real application, you'd use a geolocation service
			const country = this.getCountryFromIP(session.ipAddress);
			countryCounts.set(country, (countryCounts.get(country) || 0) + 1);
		});

		const total = sessions.length;
		return Array.from(countryCounts.entries()).map(([country, count]) => ({
			country,
			count,
			percentage: total > 0 ? (count / total) * 100 : 0,
		})).sort((a, b) => b.count - a.count).slice(0, 10);
	}

	private getTopCities(sessions: Session[]) {
		const cityCounts = new Map<string, { count: number; country: string }>();
		
		sessions.forEach(session => {
			// This is a simplified implementation
			// In a real application, you'd use a geolocation service
			const { city, country } = this.getCityFromIP(session.ipAddress || undefined);
			const key = `${city}, ${country}`;
			cityCounts.set(key, { 
				count: (cityCounts.get(key)?.count || 0) + 1,
				country 
			});
		});

		const total = sessions.length;
		return Array.from(cityCounts.entries()).map(([city, data]) => ({
			city: city.split(', ')[0] || 'Unknown',
			country: data.country,
			count: data.count,
			percentage: total > 0 ? (data.count / total) * 100 : 0,
		})).sort((a, b) => b.count - a.count).slice(0, 10);
	}

	private getTopPages(sessions: Session[], events: Event[]) {
		const pageStats = new Map<string, {
			views: number;
			uniqueViews: number;
			totalTime: number;
			bounces: number;
			totalScrollDepth: number;
		}>();

		// Count views from events
		events.filter(event => event.type === EventType.VIEW).forEach(event => {
			const page = event.data.page as string;
			if (page) {
				const stats = pageStats.get(page) || {
					views: 0,
					uniqueViews: 0,
					totalTime: 0,
					bounces: 0,
					totalScrollDepth: 0,
				};
				stats.views++;
				stats.totalTime += event.data.timeOnPage as number || 0;
				pageStats.set(page, stats);
			}
		});

		// Count unique views and bounces from sessions
		sessions.forEach(session => {
			if (session.path && session.path.length > 0) {
				const firstPage = session.path[0];
				if (firstPage) {
					const stats = pageStats.get(firstPage) || {
						views: 0,
						uniqueViews: 0,
						totalTime: 0,
						bounces: 0,
						totalScrollDepth: 0,
					};
					stats.uniqueViews++;
					if (session.path.length === 1) {
						stats.bounces++;
					}
					pageStats.set(firstPage, stats);
				}
			}
		});

		// Add scroll depth data
		events.filter(event => event.type === EventType.SCROLL).forEach(event => {
			const page = event.data.page as string;
			if (page) {
				const stats = pageStats.get(page);
				if (stats) {
					stats.totalScrollDepth += event.data.scrollDepth as number || 0;
				}
			}
		});

		return Array.from(pageStats.entries()).map(([page, stats]) => ({
			page,
			views: stats.views,
			uniqueViews: stats.uniqueViews,
			averageTimeOnPage: stats.views > 0 ? stats.totalTime / stats.views : 0,
			bounceRate: stats.uniqueViews > 0 ? (stats.bounces / stats.uniqueViews) * 100 : 0,
			avgScrollDepth: stats.views > 0 ? stats.totalScrollDepth / stats.views : 0,
		})).sort((a, b) => b.views - a.views).slice(0, 10);
	}

	private getPageFlow(sessions: Session[]) {
		const flowCounts = new Map<string, number>();
		
		sessions.forEach(session => {
			if (session.path && session.path.length > 1) {
				for (let i = 0; i < session.path.length - 1; i++) {
					const fromPage = session.path[i];
					const toPage = session.path[i + 1];
					if (fromPage && toPage) {
						const key = `${fromPage} -> ${toPage}`;
						flowCounts.set(key, (flowCounts.get(key) || 0) + 1);
					}
				}
			}
		});

		return Array.from(flowCounts.entries()).map(([flow, count]) => {
			const parts = flow.split(' -> ');
			return { 
				from: parts[0] || 'Unknown', 
				to: parts[1] || 'Unknown', 
				count 
			};
		}).sort((a, b) => b.count - a.count).slice(0, 10);
	}

	private getHourlyDistribution(sessions: Session[]) {
		const hourlyCounts = new Array(24).fill(0);
		
		sessions.forEach(session => {
			if (session.enteredAt) {
				const hour = session.enteredAt.getHours();
				hourlyCounts[hour]++;
			}
		});

		return hourlyCounts.map((count, hour) => ({
			hour,
			sessions: count,
		}));
	}

	private getDailyDistribution(sessions: Session[]) {
		const dailyCounts = new Map<string, number>();
		const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		
		sessions.forEach(session => {
			if (session.enteredAt) {
				const day = days[session.enteredAt.getDay()]!;
				dailyCounts.set(day, (dailyCounts.get(day) || 0) + 1);
			}
		});

		return days.map(day => ({
			day,
			sessions: dailyCounts.get(day) || 0,
		}));
	}

	private getSlowPages(viewEvents: Event[]) {
		const pageLoadTimes = new Map<string, number[]>();
		
		viewEvents.forEach(event => {
			const page = event.data.page as string;
			const loadTime = event.data.loadTime as number;
			if (page && loadTime) {
				const times = pageLoadTimes.get(page) || [];
				times.push(loadTime);
				pageLoadTimes.set(page, times);
			}
		});

		return Array.from(pageLoadTimes.entries()).map(([page, times]) => ({
			page,
			avgLoadTime: times.reduce((sum, time) => sum + time, 0) / times.length,
		})).sort((a, b) => b.avgLoadTime - a.avgLoadTime).slice(0, 5);
	}

	private getCountryFromIP(ipAddress?: string): string {
		// Simplified implementation - in production, use a geolocation service
		if (!ipAddress) return 'Unknown';
		
		// This is just a placeholder - you'd typically use a service like MaxMind or IP2Location
		const ipParts = ipAddress.split('.');
		if (ipParts.length === 4) {
			const firstOctet = Number.parseInt(ipParts[0] || '0', 10);
			if (firstOctet >= 1 && firstOctet <= 126) return 'United States';
			if (firstOctet >= 128 && firstOctet <= 191) return 'United States';
			if (firstOctet >= 192 && firstOctet <= 223) return 'United States';
		}
		return 'Unknown';
	}

	private getCityFromIP(ipAddress?: string): { city: string; country: string } {
		// Simplified implementation - in production, use a geolocation service
		if (!ipAddress) return { city: 'Unknown', country: 'Unknown' };
		
		const country = this.getCountryFromIP(ipAddress);
		// This is just a placeholder - you'd typically use a geolocation service
		return { city: 'Unknown', country };
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
