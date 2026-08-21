'use client';

import type { CSSProperties } from 'react';
import type { AvatarConfig } from '@cinemo/shared';
import { DEFAULT_AVATAR } from '@cinemo/shared';

type Props = {
  config?: AvatarConfig;
  className?: string;
};

function outfitBg(outfit: AvatarConfig['outfit']): string {
  if (outfit.type === 'solid') return outfit.color;
  if (outfit.type === 'stripe') {
    return `repeating-linear-gradient(45deg, ${outfit.color1}, ${outfit.color1} 3px, ${outfit.color2} 3px, ${outfit.color2} 7px)`;
  }
  return `radial-gradient(circle, ${outfit.color1} 1.5px, transparent 1.5px) 0 0 / 5px 5px, ${outfit.color2}`;
}

export function AvatarFigure({ config = DEFAULT_AVATAR, className }: Props) {
  return (
    <div
      className={`avatar-figure${className ? ` ${className}` : ''}`}
      aria-hidden
    >
      <div className="avatar-upper">
        {config.hat !== 'none' ? (
          <div
            className={`avatar-hat avatar-hat--${config.hat}`}
            style={{ '--hat-color': config.hatColor } as CSSProperties}
          />
        ) : null}
        <div className="avatar-head" style={{ background: config.skinColor }}>
          <div className="avatar-face">
            <div className="avatar-eyes">
              <span className={`avatar-eye avatar-eye--${config.eyeStyle}`} />
              <span className={`avatar-eye avatar-eye--${config.eyeStyle}`} />
            </div>
            {config.blushColor !== null ? (
              <>
                <span
                  className="avatar-blush avatar-blush--left"
                  style={{ background: `${config.blushColor}88` }}
                />
                <span
                  className="avatar-blush avatar-blush--right"
                  style={{ background: `${config.blushColor}88` }}
                />
              </>
            ) : null}
            <span
              className={`avatar-mouth avatar-mouth--${config.mouthStyle}`}
            />
          </div>
        </div>
      </div>
      <div
        className="avatar-body"
        style={{ background: outfitBg(config.outfit) }}
      />
    </div>
  );
}
