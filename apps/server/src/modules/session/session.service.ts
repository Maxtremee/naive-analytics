import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Session } from "src/db/entities/session";
import { Repository } from "typeorm";

@Injectable()
export class SessionService {
	constructor(
		@InjectRepository(Session)
		private readonly sessionRepository: Repository<Session>,
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
		const existingSession = await this.sessionRepository.findOne({
			where: {
				id: session.id,
				website: {
					apiKey: session.apiKey,
				},
			},
		});
		if (existingSession) {
			existingSession.exitedAt = session.exitedAt ?? existingSession.exitedAt;
			existingSession.duration = session.duration ?? existingSession.duration;
			existingSession.path = session.path ?? existingSession.path;
			return await this.sessionRepository.save(existingSession);
		}
		const newSession = this.sessionRepository.create({
			id: session.id,
			website: {
				apiKey: session.apiKey,
			},
			referrer: session.referrer,
			userAgent: session.userAgent,
			ipAddress: session.ipAddress,
			enteredAt: session.enteredAt,
			exitedAt: session.exitedAt,
			duration: session.duration,
			path: session.path,
			events: [],
		});
		return await this.sessionRepository.save(newSession);
	}
}
