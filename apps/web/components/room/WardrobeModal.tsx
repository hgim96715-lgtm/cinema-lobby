'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type {
  AvatarConfig,
  HatStyle,
  EyeStyle,
  MouthStyle,
} from '@cinemo/shared';
import { AvatarFigure } from './AvatarFigure';

const SKIN_COLORS = ['#f5f0e8', '#f0d4b0', '#d4975a', '#8b5e3c', '#4a2e1a'];
const HAT_COLORS = [
  '#b8914c',
  '#e85d5d',
  '#5d8fe8',
  '#6fbd6f',
  '#8f5ecb',
  '#2c2c2c',
];
const BLUSH_COLORS: (string | null)[] = [
  '#f4a7b9',
  '#f4c4a7',
  '#a7d4f4',
  '#b4f4a7',
  null,
];
const OUTFIT_COLORS = [
  '#c8a96e',
  '#5d8fe8',
  '#e85d5d',
  '#6fbd6f',
  '#8f5ecb',
  '#2c2c2c',
  '#e8d45d',
];

const HAT_OPTIONS: { value: HatStyle; label: string }[] = [
  { value: 'cap', label: '캡' },
  { value: 'beanie', label: '비니' },
  { value: 'crown', label: '왕관' },
  { value: 'none', label: '없음' },
];

const EYE_OPTIONS: { value: EyeStyle; label: string }[] = [
  { value: 'normal', label: '동그란' },
  { value: 'crescent', label: '초승달' },
  { value: 'dot', label: '점' },
];

const MOUTH_OPTIONS: { value: MouthStyle; label: string }[] = [
  { value: 'smile', label: '미소' },
  { value: 'open', label: '오픈' },
  { value: 'cat', label: '고양이' },
];

type Props = {
  initial: AvatarConfig;
  onSave: (config: AvatarConfig) => void;
  onClose: () => void;
};

export function WardrobeModal({ initial, onSave, onClose }: Props) {
  const [tempAvatar, setTempAvatar] = useState<AvatarConfig>(initial);
  const [tab, setTab] = useState<'hat' | 'face' | 'outfit'>('hat');

  function patch(partial: Partial<AvatarConfig>) {
    setTempAvatar((prev) => ({ ...prev, ...partial }));
  }

  function stripeOutfit(
    overrides: Partial<{ color1: string; color2: string }>,
  ) {
    const prev =
      tempAvatar.outfit.type === 'stripe'
        ? tempAvatar.outfit
        : { color1: OUTFIT_COLORS[0]!, color2: OUTFIT_COLORS[1]! };
    return {
      type: 'stripe' as const,
      color1: overrides.color1 ?? prev.color1,
      color2: overrides.color2 ?? prev.color2,
    };
  }

  function dotsOutfit(overrides: Partial<{ color1: string; color2: string }>) {
    const prev =
      tempAvatar.outfit.type === 'dots'
        ? tempAvatar.outfit
        : { color1: '#ffffff', color2: OUTFIT_COLORS[0]! };
    return {
      type: 'dots' as const,
      color1: overrides.color1 ?? prev.color1,
      color2: overrides.color2 ?? prev.color2,
    };
  }

  return (
    <div className="wardrobe-overlay" onClick={onClose}>
      <div className="wardrobe-panel" onClick={(e) => e.stopPropagation()}>
        <button
          className="wardrobe-close"
          type="button"
          onClick={onClose}
          aria-label="닫기"
        >
          <X size={16} strokeWidth={2} />
        </button>

        <p className="wardrobe-kicker">WARDROBE</p>

        <div className="wardrobe-preview">
          <AvatarFigure config={tempAvatar} />
        </div>

        <div className="wardrobe-tabs">
          {(['hat', 'face', 'outfit'] as const).map((t) => (
            <button
              key={t}
              type="button"
              className={`wardrobe-tab${tab === t ? ' is-active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'hat' ? '모자' : t === 'face' ? '얼굴' : '옷'}
            </button>
          ))}
        </div>

        <div className="wardrobe-section">
          {tab === 'hat' && (
            <>
              <div className="wardrobe-row">
                <span className="wardrobe-label">스타일</span>
                <div className="wardrobe-chips">
                  {HAT_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      className={`wardrobe-chip${tempAvatar.hat === value ? ' is-active' : ''}`}
                      onClick={() => patch({ hat: value })}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {tempAvatar.hat !== 'none' && (
                <div className="wardrobe-row">
                  <span className="wardrobe-label">색상</span>
                  <div className="wardrobe-swatches">
                    {HAT_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`wardrobe-swatch${tempAvatar.hatColor === color ? ' is-active' : ''}`}
                        style={{ background: color }}
                        onClick={() => patch({ hatColor: color })}
                        aria-label={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {tab === 'face' && (
            <>
              <div className="wardrobe-row">
                <span className="wardrobe-label">피부</span>
                <div className="wardrobe-swatches">
                  {SKIN_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`wardrobe-swatch${tempAvatar.skinColor === color ? ' is-active' : ''}`}
                      style={{ background: color }}
                      onClick={() => patch({ skinColor: color })}
                      aria-label={color}
                    />
                  ))}
                </div>
              </div>
              <div className="wardrobe-row">
                <span className="wardrobe-label">눈</span>
                <div className="wardrobe-chips">
                  {EYE_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      className={`wardrobe-chip${tempAvatar.eyeStyle === value ? ' is-active' : ''}`}
                      onClick={() => patch({ eyeStyle: value })}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="wardrobe-row">
                <span className="wardrobe-label">입</span>
                <div className="wardrobe-chips">
                  {MOUTH_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      className={`wardrobe-chip${tempAvatar.mouthStyle === value ? ' is-active' : ''}`}
                      onClick={() => patch({ mouthStyle: value })}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="wardrobe-row">
                <span className="wardrobe-label">볼터치</span>
                <div className="wardrobe-swatches">
                  {BLUSH_COLORS.map((color) => (
                    <button
                      key={color ?? 'none'}
                      type="button"
                      className={`wardrobe-swatch${tempAvatar.blushColor === color ? ' is-active' : ''}${color === null ? ' wardrobe-swatch--none' : ''}`}
                      style={color ? { background: color } : undefined}
                      onClick={() => patch({ blushColor: color })}
                      aria-label={color ?? '없음'}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === 'outfit' && (
            <>
              <div className="wardrobe-row">
                <span className="wardrobe-label">패턴</span>
                <div className="wardrobe-chips">
                  <button
                    type="button"
                    className={`wardrobe-chip${tempAvatar.outfit.type === 'solid' ? ' is-active' : ''}`}
                    onClick={() =>
                      patch({
                        outfit: { type: 'solid', color: OUTFIT_COLORS[0]! },
                      })
                    }
                  >
                    단색
                  </button>
                  <button
                    type="button"
                    className={`wardrobe-chip${tempAvatar.outfit.type === 'stripe' ? ' is-active' : ''}`}
                    onClick={() => patch({ outfit: stripeOutfit({}) })}
                  >
                    줄무늬
                  </button>
                  <button
                    type="button"
                    className={`wardrobe-chip${tempAvatar.outfit.type === 'dots' ? ' is-active' : ''}`}
                    onClick={() => patch({ outfit: dotsOutfit({}) })}
                  >
                    도트
                  </button>
                </div>
              </div>

              {tempAvatar.outfit.type === 'solid' && (
                <div className="wardrobe-row">
                  <span className="wardrobe-label">색상</span>
                  <div className="wardrobe-swatches">
                    {OUTFIT_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`wardrobe-swatch${tempAvatar.outfit.type === 'solid' && tempAvatar.outfit.color === color ? ' is-active' : ''}`}
                        style={{ background: color }}
                        onClick={() =>
                          patch({ outfit: { type: 'solid', color } })
                        }
                        aria-label={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {tempAvatar.outfit.type === 'stripe' && (
                <>
                  <div className="wardrobe-row">
                    <span className="wardrobe-label">색상 1</span>
                    <div className="wardrobe-swatches">
                      {OUTFIT_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`wardrobe-swatch${tempAvatar.outfit.type === 'stripe' && tempAvatar.outfit.color1 === color ? ' is-active' : ''}`}
                          style={{ background: color }}
                          onClick={() =>
                            patch({ outfit: stripeOutfit({ color1: color }) })
                          }
                          aria-label={color}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="wardrobe-row">
                    <span className="wardrobe-label">색상 2</span>
                    <div className="wardrobe-swatches">
                      {OUTFIT_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`wardrobe-swatch${tempAvatar.outfit.type === 'stripe' && tempAvatar.outfit.color2 === color ? ' is-active' : ''}`}
                          style={{ background: color }}
                          onClick={() =>
                            patch({ outfit: stripeOutfit({ color2: color }) })
                          }
                          aria-label={color}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {tempAvatar.outfit.type === 'dots' && (
                <>
                  <div className="wardrobe-row">
                    <span className="wardrobe-label">도트색</span>
                    <div className="wardrobe-swatches">
                      {['#ffffff', '#f4e4b8', ...OUTFIT_COLORS].map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`wardrobe-swatch${tempAvatar.outfit.type === 'dots' && tempAvatar.outfit.color1 === color ? ' is-active' : ''}`}
                          style={{ background: color }}
                          onClick={() =>
                            patch({ outfit: dotsOutfit({ color1: color }) })
                          }
                          aria-label={color}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="wardrobe-row">
                    <span className="wardrobe-label">배경색</span>
                    <div className="wardrobe-swatches">
                      {OUTFIT_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`wardrobe-swatch${tempAvatar.outfit.type === 'dots' && tempAvatar.outfit.color2 === color ? ' is-active' : ''}`}
                          style={{ background: color }}
                          onClick={() =>
                            patch({ outfit: dotsOutfit({ color2: color }) })
                          }
                          aria-label={color}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="wardrobe-actions">
          <button type="button" className="lobby-btn" onClick={onClose}>
            취소
          </button>
          <button
            type="button"
            className="lobby-btn lobby-btn--primary"
            onClick={() => {
              onSave(tempAvatar);
            }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
