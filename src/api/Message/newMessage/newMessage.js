import { prisma } from "../../../../generated/prisma-client";
import { ROOM_FRAGMENT } from "../../../fragments";

export default {
  Subscription: {
    newMessage: {
      subscribe: (_, args) => {
        const { roomId } = args;
        return prisma.$subscribe.message({
          AND: [
            { mutation_in: "CREATED" },
            {
              node: {
                room: { id: roomId }
              }
            }
          ]
        }).node();
      },
      resolve: (payload, args, context) => {
        console.log(args, context);
        return payload;
      }
    }
  }
};
