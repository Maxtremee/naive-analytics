import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EventType } from "../../modules/event/event-type";
import { Session } from "./session";

@Entity()
export class Event {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({
		type: "enum",
		enum: EventType,
	})
	type!: EventType;

	@ManyToOne(
		() => Session,
		(session) => session.id,
		{
			nullable: true,
		},
	)
	session?: Session;

	@Column({
		type: "jsonb",
	})
	data!: Record<string, unknown>;
}
