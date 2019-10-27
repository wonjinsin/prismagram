import {generateSecret, sendSecretMail} from "../../../../utils";
import {prisma} from "../../../../../generated/prisma-client"

export default{
  Mutation: {
    requestSecret: async (_, args, {request}) => {
      console.log(request.user);
      const { email } = args;
      const loginSecret = generateSecret(0);
      try{
        return true;
        await sendSecretMail(email, loginSecret);
        await prisma.updateUser({
          data:{loginSecret}, where: {email}
        })
        return true;
      }
      catch(e){
        console.log(e);
        return false;
      }

    }
  }
}
