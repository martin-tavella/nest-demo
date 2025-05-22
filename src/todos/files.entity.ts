import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Todo } from "./todos.entity";

@Entity({name: "files"})
export class File {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name:string;

    @Column()
    mimeType:string;

    @Column({ type: "bytea"})
    data: Buffer;

    @ManyToOne(()=>Todo,(todo: Todo) => todo.files)
    @JoinColumn()
    todo: Todo;
}