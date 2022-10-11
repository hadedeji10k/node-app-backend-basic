import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { Container } from "typedi";
import { User } from "../../database/repository";
import { IUser } from "../../interfaces";
import { differenceInDays, startOfDay } from "date-fns";

interface IOptions {
  optional?: boolean;
}

const user = Container.get(User);

function checkDayStreak(options: IOptions = {}) {
  return async (request: FastifyRequest, _reply: FastifyReply, done: HookHandlerDoneFunction) => {
    try {
      const userExists = request.user as IUser;

      const today = startOfDay(new Date());
      const lastDayStreak = userExists.lastDayStreak || today;

      const difference = differenceInDays(today, lastDayStreak);

      const data = {
        lastDayStreak: today,
        currentDayStreak: difference === 1 ? { increment: 1 } : 1,
      };

      if (difference === 1 || difference > 1) {
        user.updateUser({ id: userExists.id }, data);
      }

    } catch (e) {
      if (!options.optional) {
        done(e as Error);
      }
    }
  };
}

export const dayStreak = { checkDayStreak };
