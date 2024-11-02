//định nghĩa lại tất cả các thư viện thay thế type_modules
import { Request } from 'express'
import { TokenPayLoad } from './models/requests/users.requests'
declare module 'express' {
  interface Request {
    decode_authorization?: TokenPayLoad
    decode_refresh_token?: TokenPayLoad
  }
}
