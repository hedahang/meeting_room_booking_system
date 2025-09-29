import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Permission } from './permission.entity';

@Entity({
  name: 'roles',
}) // 角色表
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
    comment: '角色名称',
  })
  name: string;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permissions',
  })
  permissions: Permission[];
}
