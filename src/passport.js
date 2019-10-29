import "./env";
import {prisma} from "../generated/prisma-client"

//헤더 값에 토큰을 입력하는 역할
import passport from "passport";
import {Strategy, ExtractJwt} from "passport-jwt";

const jwtOptions ={
  // 헤더값에서 토큰을 가져옴
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey:process.env.JWT_SECRET
};

// done은 사용자를 찾았을떄 사용하는 함수
// payload는 해석한 결과, done은 return 할때 도아주는 역할
const verifyUser = async (payload, done) => {
  try{
    const user = await prisma.user({id: payload.id});
    if(user !== null){
      return done(null, user); // 첫번쨰 null은 error가 없다는 의미, 두번쨰가 return 값
    } else{
      return done(null, false);
    }
  }
  catch(e){
    return done(e, false);
  }
}

// 미들웨어 함수라 req, res, next를 인자로 받음
export const authenticateJwt = (req, res, next) =>
  passport.authenticate("jwt", { session: false }, (error, user) => {
  if(user){
    req.user = user;
  }
  next(); // route 시작하게
})(req, res, next); // 앞에 authenticate 실행되면, req, res, next 함수 실행


// Request에서 받은 토큰을 해석, callback에 연결(2번쨰 인자가 callback)
passport.use(new Strategy(jwtOptions, verifyUser));
passport.initialize();
