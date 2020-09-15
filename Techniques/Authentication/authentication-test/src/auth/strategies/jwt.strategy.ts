import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "src/auth/constants/constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  /**
     * jwtFremRequest -> xuất jwt từ req client gửi lên
     * ignoreExpiration -> đảm bảo jwt chưa hết hạn cho passport module
     * secretOrKey -> chuỗi, cached chứa key public secret, hoặc mã hoá PEM -> xác minh token's signature (chữ ký mã thông báo).
     */
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}