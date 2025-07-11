import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { Session } from "./session";

@Entity()
export class Website {
	@PrimaryGeneratedColumn()
	id!: number;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;

	@Column()
	name!: string;

	@Column()
	url!: string;

	@Column()
	owner!: string;

	@Column({
		unique: true,
	})
	apiKey!: string;

	@OneToMany(
		() => Session,
		(session) => session.website,
	)
	sessions!: Session[];
}
