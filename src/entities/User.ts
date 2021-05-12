import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType, Int } from "type-graphql";

@ObjectType() //convert to graphQL type - notice how we can stack decorators
@Entity()
export class User {

  @Field(() => Int)
  @PrimaryKey()
  _id!: number;

  @Field(() => String)
  @Property()
  createdAt: Date = new Date();

  @Field(() => String)
  @Property({ type : 'date', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Field(() => String)
  @Property({type : "text", unique : true})
  username!: String;

  //removing field -> doesn't allow for selection, just a column
  @Property({type : "text", unique : true})
  password!: String;
}