import express, { Request, Response } from 'express'
import { loginController, logoutController, registerController } from '~/controllers/users.controllers'
import {
  accessValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { wrapAsync } from '~/utils/handlers'
//đựng user Router
const userRouter = express.Router()

//setup middleware

// no co next la middleware
// cos next mới dc đi, ko có next thì dừng lại
//  dc dùng làm bộ lọc, dc thì di tiếp ko dc dừng lại

/*
desc: Resgister a new user
path: /register
Method: post
Body: {
    name: string,
    email: string,
    password: string,
    confirm_password: string,
    date_of_birth: string có dạng ISO8601
}
*/
userRouter.post('/register', registerValidator, wrapAsync(registerController))

// /users/login
/*
desc ; login
path : users/login
method : post
body:{
    email :string,
    password : string
}

 */

userRouter.post('/login', loginValidator, wrapAsync(loginController)) // cai nay goi la headler

/*
desc : logout
path : users/logout
method : post
header : authorization: 'Bearer < accesss_token>
body :{
    refresh_token : string
}
 */
userRouter.post('/logout', accessValidator, refreshTokenValidator, wrapAsync(logoutController))

export default userRouter
