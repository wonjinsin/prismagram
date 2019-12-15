import "./env";
import { GraphQLServer } from "graphql-yoga";
import { sendSecretMail } from "./utils";
import logger from "morgan";
import passport from "passport";
import schema from "./schema";
import "./passport";
import { authenticateJwt } from "./passport";
import { isAuthenticated } from "./middlewares"
import { uploadMiddleware, uploadController } from "./upload";

const PORT = process.env.PORT || 4000;

// context는 resolver 사이에서 정보공유할때 사용
const server = new GraphQLServer({
  schema,
  // context 첫번째 인자는 req인데, req.request를 request라는 변수에 담고
  // return값은 request: request이다
  context: ({request}) => ({request, isAuthenticated })
});


// 미들웨어 관련
// server.express.use 즉, 이 middleware 거치고 나야 graphql 서버가 시작됨
server.express.use(logger("dev"));
server.express.use(authenticateJwt);
server.express.post("/api/upload", uploadMiddleware, uploadController);

server.start({ port: PORT }, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
