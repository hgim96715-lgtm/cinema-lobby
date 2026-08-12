import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: '이메일', example: 'test@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '비밀번호', example: 'password123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: '닉네임', example: 'test' })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  nickname: string;
}
