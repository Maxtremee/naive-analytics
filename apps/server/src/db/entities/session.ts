import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Event } from "./event";
import { Website } from "./website";

@Entity()
export class Session {
	@PrimaryColumn()
	id!: string;

	@ManyToOne(
		() => Website,
		(website) => website.id,
		{
			nullable: true,
		},
	)
	website?: Website;

	@Column({
		nullable: true,
	})
	referrer?: string;

	@Column({
		nullable: true,
	})
	userAgent?: string;

	@Column({
		nullable: true,
	})
	ipAddress?: string;

	@Column({
		type: "timestamp",
		nullable: true,
	})
	enteredAt?: Date;

	@Column({
		type: "timestamp",
		nullable: true,
	})
	exitedAt?: Date;

	@Column({
		nullable: true,
	})
	duration?: number;

	@Column({
		nullable: true,
		type: "jsonb",
	})
	path?: string[];

	@OneToMany(
		() => Event,
		(event) => event.session,
	)
	events!: Event[];
}
