import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { Container } from "typedi";
import { User } from "../../database/repository";
import { IUser } from "../../interfaces";
import { Message } from "../../utils";

interface IOptions {
  optional?: boolean;
}

const user = Container.get(User);

function userAuth(options: IOptions = {}) {
  return async (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
    try {
      const data: { id: string } = await request.jwtVerify();

      const userExists = await user.findById(data.id);
      if (!userExists) {
        throw new Error(Message.userNotFound);
      }

      request.user = userExists;
    } catch (e) {
      if (!options.optional) {
        done(e as Error);
      }
    }
  };
}

function isAdmin(options: IOptions = {}) {
  return async (request: FastifyRequest, _reply: FastifyReply, done: HookHandlerDoneFunction) => {
    try {
      const user = request.user as IUser;

      if (user?.role !== "ADMIN") {
        throw new Error(Message.notAuthorized);
      }
    } catch (e) {
      if (!options.optional) {
        done(e as Error);
      }
    }
  };
}

export const auth = { user: userAuth, isAdmin };
