
import { Resolver, Arg, Mutation, Ctx, Field, InputType, ObjectType, FieldResolver } from "type-graphql";
import {MyContext} from "../types";
import {User} from "../entities/User";
import argon2 from 'argon2'
@InputType() //use as inputs for query
class UsernamePasswordInput{
    @Field()
    username : string
    @Field()
    password : string
}

@ObjectType()
class FieldError{
    @Field()
    field: string;
    @Field()
    message: string
}
@ObjectType() //return from our mutations
class UserResponse{
    @Field(() => [FieldError], {nullable : true})
    errors?: FieldError[]

    @Field(() => User, {nullable : true}) //user returned if no errors
    user?: User
}


@Resolver()
export class UserResolver{
    @Mutation( () => UserResponse)
    async register(
        @Arg("options") options : UsernamePasswordInput,
        @Ctx() {em} : MyContext
    ){
        const hashedPass = await argon2.hash(options.password);
        const user = em.create(User, {username : options.username, password : hashedPass})
        await em.persistAndFlush(user);
        return user;
        
    }
    @Mutation( () => UserResponse)
    async login(
        @Arg("options") options : UsernamePasswordInput,
        @Ctx() {em} : MyContext
    ) : Promise<UserResponse>{
        const user = await em.findOne(User, {username : options.username});
        if(!user){
            return {
                errors : [{
                    field : 'username',
                    message : 'could not find a username'
                }]
            }
        }
        const valid = await argon2.verify(user.password,options.password)
        if(!valid){
            return {
                errors : [{
                    field : 'password',
                    message : 'incorrect password'
                }]
            }
        }
        return {
            user
        }
        
        
        
    }
}


