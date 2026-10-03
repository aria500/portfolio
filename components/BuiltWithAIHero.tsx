"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const WATER_STEP = 300;
const WATER_TARGET = 2100;
const STAGE_COUNT = 6;

const FLOWERS = [
  { name: "Flame lily", folder: "01-green", className: "garden-flower--one" },
  { name: "Yellow daisies", folder: "06-daisy-yellow", className: "garden-flower--two" },
  { name: "Blue bells", folder: "03-blue", className: "garden-flower--three" },
  { name: "Hydrangea", folder: "02-purple", className: "garden-flower--four" },
  { name: "Tulips", folder: "05-tulip", className: "garden-flower--five" },
  { name: "Yellow daisies", folder: "06-daisy-yellow", className: "garden-flower--six" },
  { name: "Pink blossom", folder: "07-pink", className: "garden-flower--seven" },
  { name: "Blue bells", folder: "03-blue", className: "garden-flower--eight" },
];

const sourceFor = (folder: string, stage: number) =>
  `/plants/${folder}/stage-${stage + 1}.png`;

type GardenFlowerProps = {
  flower: (typeof FLOWERS)[number];
  stage: number;
  previousStage: number | null;
  watering: boolean;
  feedbackKey: number;
  onWater: () => void;
};

function GardenFlower({ flower, stage, previousStage, watering, feedbackKey, onWater }: GardenFlowerProps) {
  return (
    <button
      type="button"
      className={`garden-flower ${flower.className}${watering ? " is-watering" : ""}`}
      onClick={onWater}
      aria-label={`Water ${flower.name}. Growth stage ${stage + 1} of ${STAGE_COUNT}`}
    >
      <span className="garden-flower__motion">
        <span className="garden-flower__art">
          {previousStage !== null ? (
            <Image
              src={sourceFor(flower.folder, previousStage)}
              alt=""
              fill
              sizes="(max-width: 760px) 30vw, 210px"
              className="garden-flower__image garden-flower__image--previous"
            />
          ) : null}
          <Image
            key={`${flower.name}-${stage}`}
            src={sourceFor(flower.folder, stage)}
            alt=""
            fill
            sizes="(max-width: 760px) 30vw, 210px"
            className="garden-flower__image"
            priority={flower.folder === "flower-05"}
          />
        </span>
        <span className={`garden-flower__ripple${watering ? " is-watering" : ""}`} />
        {watering ? <span key={feedbackKey} className="garden-water-drops"><i /><i /><i /></span> : null}
      </span>
    </button>
  );
}

export function BuiltWithAIHero() {
  const fadeTimersRef = useRef<number[]>([]);
  const feedbackTimerRef = useRef(0);
  const countFrameRef = useRef(0);
  const initialGarden: { water: number; stages: number[] } = { water: 0, stages: FLOWERS.map((_, index) => index === 3 ? 3 : [0, 4, 7].includes(index) ? 1 : 0) };
  const gardenRef = useRef(initialGarden);
  const [garden, setGarden] = useState(initialGarden);
  const [displayWater, setDisplayWater] = useState(0);
  const [previousStages, setPreviousStages] = useState<(number | null)[]>(FLOWERS.map(() => null));
  const [wateringPlant, setWateringPlant] = useState<number | null>(null);
  const [feedbackKey, setFeedbackKey] = useState(0);

  const waterFlower = useCallback((index: number) => {
    window.clearTimeout(feedbackTimerRef.current);
    setWateringPlant(index);
    setFeedbackKey((key) => key + 1);
    feedbackTimerRef.current = window.setTimeout(() => {
      setWateringPlant(null);
    }, 460);

    const current = gardenRef.current;
    const canGrow = current.stages[index] < STAGE_COUNT - 1;
    const canAddWater = current.water < WATER_TARGET;
    if (!canGrow && !canAddWater) return;

    if (canGrow) {
      setPreviousStages((previous) => previous.map((stage, itemIndex) => itemIndex === index ? current.stages[index] : stage));
      fadeTimersRef.current.push(window.setTimeout(() => {
        setPreviousStages((previous) => previous.map((stage, itemIndex) => itemIndex === index ? null : stage));
      }, 230));
    }

    const nextGarden = {
      water: canAddWater ? Math.min(WATER_TARGET, current.water + WATER_STEP) : current.water,
      stages: current.stages.map((stage, itemIndex) => itemIndex === index && canGrow ? stage + 1 : stage),
    };
    gardenRef.current = nextGarden;
    setGarden(nextGarden);
  }, []);

  useEffect(() => {
    const from = displayWater;
    const to = garden.water;
    if (from === to) return;
    const startedAt = performance.now();
    cancelAnimationFrame(countFrameRef.current);
    const update = (now: number) => {
      const progress = Math.min((now - startedAt) / 380, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayWater(Math.round(from + (to - from) * eased));
      if (progress < 1) countFrameRef.current = requestAnimationFrame(update);
    };
    countFrameRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(countFrameRef.current);
  }, [garden.water]);

  useEffect(() => () => {
    fadeTimersRef.current.forEach(window.clearTimeout);
    window.clearTimeout(feedbackTimerRef.current);
    cancelAnimationFrame(countFrameRef.current);
  }, []);

  const progress = Math.min(garden.water / WATER_TARGET, 1);
  const completed = garden.water === WATER_TARGET;
  const activeStep = garden.water / WATER_STEP;

  return (
    <div className={`built-ai-hero${completed ? " is-complete" : ""}`} aria-label={`Interactive digital garden. Today's water is ${garden.water} milliliters.`}>
      <section className="built-ai-info" aria-label="Garden progress">
        <div className="built-ai-metric" aria-live="polite">
          <span className="built-ai-eyebrow">TODAY&apos;S WATER</span>
        <p className="built-ai-water"><span>{displayWater.toLocaleString()}</span><small>ml</small></p>
          <div className="built-ai-progress-row">
            <div className="built-ai-progress" role="progressbar" aria-label="Today's water progress" aria-valuemin={0} aria-valuemax={WATER_TARGET} aria-valuenow={garden.water}>
              <span style={{ transform: `scaleX(${progress})` }} />
            </div>
            <span>{Math.round(progress * 100)}%</span>
          </div>
        </div>

        <div className="built-ai-status">
          <span className="built-ai-sprout" aria-hidden="true" />
          <p><strong>{completed ? "已盛开" : "在生长"}</strong><small>{completed ? "Bloom" : "Growing"}</small></p>
        </div>

        <div className="built-ai-journey" aria-label="Growing journey from drink to bloom">
          <span className="built-ai-journey__label">GROWING JOURNEY</span>
          <div className="built-ai-journey__track"><i style={{ transform: `scaleX(${progress})` }} /></div>
          <div className="built-ai-journey__dots">
            {Array.from({ length: 8 }, (_, index) => <i key={index} className={index <= activeStep ? "is-active" : ""} />)}
          </div>
          <div className="built-ai-journey__words"><span>DRINK</span><span>GROW</span><span>BLOOM</span></div>
        </div>
      </section>

      <div className="garden-hint">点击花朵<br />给它浇点水<span aria-hidden="true" /></div>
      <span className="garden-decoration garden-decoration--one" />
      <span className="garden-decoration garden-decoration--two" />
      <span className="garden-decoration garden-decoration--three" />

      <div className="digital-garden">
        <div className="digital-garden__ground" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        {FLOWERS.map((flower, index) => (
          <GardenFlower
            key={flower.className}
            flower={flower}
            stage={garden.stages[index]}
            previousStage={previousStages[index]}
            watering={wateringPlant === index}
            feedbackKey={feedbackKey}
            onWater={() => waterFlower(index)}
          />
        ))}
      </div>

      <p className="garden-caption">好好喝水，让生活开出花来。</p>
    </div>
  );
}
