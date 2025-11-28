import { User, IUser } from '../models/User';
import jwt from 'jsonwebtoken';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

interface TokenPayload {
  userId: string;
  username: string;
}

export class AuthService {
  private accessTokenSecret = process.env.JWT_SECRET || 'access-secret-key';
  private refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret-key';

  async register(data: RegisterData): Promise<{ user: any; accessToken: string; refreshToken: string }> {
    const existingUser = await User.findOne({ $or: [{ username: data.username }, { email: data.email }] });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = await User.create({
      username: data.username,
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      voiceEnabled: true,
      notificationsEnabled: true,
    });

    const { accessToken, refreshToken } = this.generateTokens({ userId: user._id.toString(), username: user.username });
    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async login(credentials: LoginCredentials): Promise<{ user: any; accessToken: string; refreshToken: string }> {
    const user = await User.findOne({ username: credentials.username });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(credentials.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const { accessToken, refreshToken } = this.generateTokens({ userId: user._id.toString(), username: user.username });
    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, this.refreshTokenSecret) as TokenPayload;
      const user = await User.findById(decoded.userId);
      
      if (!user || user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      const { accessToken } = this.generateTokens({ userId: user._id.toString(), username: user.username });
      return { accessToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.accessTokenSecret) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  private generateTokens(payload: TokenPayload): { accessToken: string; refreshToken: string } {
    const accessToken = jwt.sign(payload, this.accessTokenSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, this.refreshTokenSecret, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: IUser): any {
    const obj = user.toObject();
    delete obj.password;
    delete obj.refreshToken;
    return obj;
  }
}

export const authService = new AuthService();
