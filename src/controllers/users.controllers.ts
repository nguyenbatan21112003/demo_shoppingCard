import { NextFunction, Request, Response } from 'express'
import { LoginReqBody, LogoutReqBody, RegisterReqBody, TokenPayLoad } from '~/models/requests/users.requests'
import User from '~/models/schemas/User.schema'
import databaseServices from '~/services/database.services'
import usersServices from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import exp from 'constants'

// controller la handler co nhiem vu xu ly logic
// cac thoong tin khi da vao controller thi phai clear

//registerController nhan vao thong tin dang ky cua nguoi dung
// va vao database de tao user moi luu vao
export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body

  //vao database vaf nhet vao collection

  // throw new Error('Loi rot manggg')

  // kiểm tra email có tồn tại hay chưa | có ai dùng email này chưa | email có bị trùng k
  const isDup = await usersServices.checkEmailExist(email)
  if (isDup) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.UNPROCESSABLE_ENTITY, //422
      message: USERS_MESSAGES.EMAIL_ALREADY_EXISTS
    })
  }

  const result = await usersServices.register(req.body)
  res.status(201).json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    data: result
  })
}

export const loginController = async (
  req: Request<ParamsDictionary, any, LoginReqBody>,
  res: Response,
  next: NextFunction
) => {
  // throw new Error('ahihi')
  //dùng email và password tìm user đang sở hữu chúng
  //nếu có user đó tồn tại nghĩa là đăng nhập thành công
  const { email, password } = req.body
  //vào database tìm
  const result = await usersServices.login({ email, password })
  //
  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result //là ac và rf
  })
}

export const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token } = req.body
  //so user_id với ac với rf có phải cùng 1 cái ko
  const { user_id: user_id_at } = req.decode_authorization as TokenPayLoad
  const { user_id: user_id_rf } = req.decode_refresh_token as TokenPayLoad
  if (user_id_at != user_id_rf) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.UNAUTHORIZED, //401
      message: USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID
    })
  }
  //nếu đã khớp mã thì kiểm tra xem rf có trong database hay ko ?
  await usersServices.checkRefreshToken({
    user_id: user_id_rf,
    refresh_token
  })
  //nếu có thì mình mới logout(xóa refreshToken)
  await usersServices.logout(refresh_token)
  //
  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.LOGOUT_SUCCESS
  })
}
