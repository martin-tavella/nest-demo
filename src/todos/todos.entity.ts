import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { File } from "./files.entity";

@Entity({
    name:"todos"
})
export class Todo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    isCompleted: boolean;

    @OneToMany(()=>File,(file: File)=>file.todo)
    files: File[];
}