import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Session } from "src/db/entities/session";
import { Repository } from "typeorm";
import { WebsiteService } from "../website/website.service";

@Injectable()
export class SessionService {
	private readonly logger = new Logger(SessionService.name);
	constructor(
		@InjectRepository(Session)
		private readonly sessionRepository: Repository<Session>,
		@Inject(WebsiteService)
		private readonly websiteService: WebsiteService,
	) {}

	async upsertSession(session: {
		id: string;
		apiKey: string;
		referrer?: string;
		userAgent?: string;
		ipAddress?: string;
		enteredAt?: Date;
		exitedAt?: Date;
		duration?: number;
		path?: string[];
	}) {
		const website = await this.websiteService.getWebsiteByApiKey(
			session.apiKey,
		);
		if (!website) {
			throw new Error("Website not found");
		}
		const existingSession = await this.sessionRepository.findOne({
			where: {
				id: session.id,
				website: {
					id: website.id,
				},
			},
		});
		if (existingSession) {
			this.logger.log(`Updating session: ${session.id}`);
			if (session.referrer) {
				existingSession.referrer = session.referrer;
			}
			if (session.userAgent) {
				existingSession.userAgent = session.userAgent;
			}
			if (session.ipAddress) {
				existingSession.ipAddress = session.ipAddress;
			}
			if (session.enteredAt) {
				existingSession.enteredAt = session.enteredAt;
			}
			if (session.exitedAt) {
				existingSession.exitedAt = session.exitedAt;
			}
			if (session.duration) {
				existingSession.duration = session.duration;
			}
			if (session.path) {
				existingSession.path = session.path;
			}
			return await this.sessionRepository.save(existingSession);
		}
		this.logger.log(`Creating new session: ${session.id}`);
		const newSession = this.sessionRepository.create({
			website: {
				id: website.id,
			},
			...session,
		});
		return await this.sessionRepository.save(newSession);
	}

	async getSession(id: string) {
		return await this.sessionRepository.findOne({
			where: {
				id,
			},
		});
	}
}
