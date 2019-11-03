import { prisma } from "../../../generated/prisma-client";

export default {
  User: {
    fullName: (parent, __, { request }) => {
      return `${parent.firstName} ${parent.lastName}`;
    },
    isFollowing: async (parent, _, { request }) => {
      const { user } = request;
      // parent.id를 parentId라는 변수에 넣는 방법
      // UserProfile은 요청한 사람이 Userprofile얻으려는 대상을 팔로잉 했는지 알아보는 방법
      const { id: parentId } = parent;
      return prisma.$exists.user({
        AND: [
          {
            id: parentId
          },
          {
            followers_some: {
              id: user.id
            }
          }
        ]
      }); // return promise if exists
    },
    isSelf: (parent, _, { request }) => {
      const { user } = request;
      const { id: parentId } = parent;
      return user.id === parentId;
    }
  }
};
