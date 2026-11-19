
"use client";

import {
  Pause,
  Play,
} from "lucide-react";

type HeroControlsProps = {
  active: number;
  progress: number;
  paused: boolean;
  reducedMotion: boolean;
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onTogglePause: () => void;
};

const sceneNames = [
  "Cinematic introduction",
  "Selected projects",
  "Our expertise",
];

export default function HeroControls({
  active,
  progress,
  paused,
  reducedMotion,
  onSelect,
  onPrevious,
  onNext,
  onTogglePause,
}: HeroControlsProps) {
  return (
    <div className="mh-controls">
      <div className="mh-progress-list">
        {sceneNames.map((name, index) => (
          <button
            key={name}
            type="button"
            className={`mh-progress-item ${
              active === index ? "is-active" : ""
            }`}
            onClick={() => onSelect(index)}
            aria-label={`Show ${name}`}
            aria-current={active === index ? "true" : undefined}
          >
            <span className="mh-progress-track">
              <span
                className="mh-progress-fill"
                style={{
                  width:
                    index === active
                      ? `${reducedMotion ? 100 : progress}%`
                      : index < active
                        ? "100%"
                        : "0%",
                }}
              />
            </span>
            <span className="mh-progress-label">
              <span>0{index + 1}</span>
              <span className="mh-progress-name">{name}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="mh-control-actions">
        {!reducedMotion && (
          <button
            type="button"
            onClick={onTogglePause}
            aria-label={paused ? "Resume slideshow" : "Pause slideshow"}
            aria-pressed={paused}
          >
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}