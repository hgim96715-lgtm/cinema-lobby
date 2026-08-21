import {
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class SolidOutfitDto {
  @IsIn(['solid'])
  type!: 'solid';

  @IsString()
  color!: string;
}

class StripeOutfitDto {
  @IsIn(['stripe'])
  type!: 'stripe';

  @IsString()
  color1!: string;

  @IsString()
  color2!: string;
}

class DotsOutfitDto {
  @IsIn(['dots'])
  type!: 'dots';

  @IsString()
  color1!: string;

  @IsString()
  color2!: string;
}

/** discriminator 서브타입 공통 베이스 (class-transformer용) */
class OutfitDto {
  @IsIn(['solid', 'stripe', 'dots'])
  type!: 'solid' | 'stripe' | 'dots';
}

export class UpdateAvatarDto {
  @IsIn(['cap', 'beanie', 'crown', 'none'])
  hat!: 'cap' | 'beanie' | 'crown' | 'none';

  @IsString()
  hatColor!: string;

  @IsString()
  skinColor!: string;

  @IsIn(['normal', 'crescent', 'dot'])
  eyeStyle!: 'normal' | 'crescent' | 'dot';

  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsString()
  blushColor!: string | null;

  @IsIn(['smile', 'open', 'cat'])
  mouthStyle!: 'smile' | 'open' | 'cat';

  @IsObject()
  @ValidateNested()
  @Type(() => OutfitDto, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'type',
      subTypes: [
        { value: SolidOutfitDto, name: 'solid' },
        { value: StripeOutfitDto, name: 'stripe' },
        { value: DotsOutfitDto, name: 'dots' },
      ],
    },
  })
  outfit!: SolidOutfitDto | StripeOutfitDto | DotsOutfitDto;
}
