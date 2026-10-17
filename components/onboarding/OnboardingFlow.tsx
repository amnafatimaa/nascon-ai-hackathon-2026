"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { InterestSelector } from "@/components/onboarding/InterestSelector";
import { ProgressRail } from "@/components/ui/ProgressRail";
import {
  getOnboardingServerSnapshot,
  getOnboardingSnapshot,
  saveOnboardingPreferences,
  subscribeOnboarding,
} from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import type {
  EditionSize,
  GeographicFocus,
  OnboardingPreferences,
  SummaryLength,
} from "@/lib/types";

const STEPS = ["Welcome", "Interests", "Reading", "Ready"];

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const prefs = useSyncExternalStore(
    subscribeOnboarding,
    getOnboardingSnapshot,
    getOnboardingServerSnapshot,
  );
  const [customDraft, setCustomDraft] = useState("");

  function update(partial: Partial<OnboardingPreferences>) {
    saveOnboardingPreferences({ ...prefs, ...partial });
  }

  function addCustom() {
    const value = customDraft.trim();
    if (!value) return;
    if (prefs.customInterests.includes(value)) {
      setCustomDraft("");
      return;
    }
    update({ customInterests: [...prefs.customInterests, value] });
    setCustomDraft("");
  }

  async function complete() {
    setIsSaving(true);

    // Combine standard interest slugs and custom interests into one list
    const allTopics = [...prefs.interests, ...prefs.customInterests];

    try {
      // Write user preferences payload to Supabase user_preferences table
      const { error } = await supabase.from("user_preferences").insert([
        {
          topics: {
            interests: allTopics,
            summaryLength: prefs.summaryLength,
            editionSize: prefs.editionSize,
            geographicFocus: prefs.geographicFocus,
          },
        },
      ]);

      if (error) {
        console.error("Supabase insert error:", error);
      }
    } catch (err) {
      console.error("Failed to sync preferences to Supabase:", err);
    } finally {
      // Persist locally and navigate
      saveOnboardingPreferences({ ...prefs, completed: true });
      setIsSaving(false);
      router.push("/paper");
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-12 md:px-8 md:py-16 selection:bg-burgundy selection:text-cream">
      {/* Kicker Header */}
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" />
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-burgundy font-bold">
          Compose Your Paper
        </p>
      </div>

      <h1 className="mt-3 font-serif text-4xl font-bold leading-tight md:text-5xl text-ink">
        A few choices before the press run.
      </h1>
      <p className="mt-3 max-w-xl text-[15px] leading-7 text-ink-soft">
        Selections stay on this device and sync dynamically to your reader profile.
      </p>

      {/* Progress Rail */}
      <div className="mt-10">
        <ProgressRail step={step} total={4} labels={STEPS} />
      </div>

      {/* Step Content */}
      <section className="mt-10 min-h-[300px]">
        {step === 1 ? (
          <div className="space-y-5">
            <span className="inline-block bg-burgundy/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-burgundy font-semibold">
              Step 01 / Introduction
            </span>
            <h2 className="font-serif text-3xl font-bold text-ink">
              Welcome to the composing room.
            </h2>
            <p className="max-w-xl text-[15px] leading-7 text-ink-soft">
              DAYBREAK is a modern morning newspaper that learns what you care about, then sets those stories into a tailored print edition.
            </p>
            <p className="max-w-xl text-[15px] leading-7 text-ink-soft">
              Your selections train Gemini AI and our ranking engine to emphasize topics you love while skipping the noise. You can skip this step anytime to read today’s general edition.
            </p>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-6">
            <div>
              <span className="inline-block bg-burgundy/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-burgundy font-semibold">
                Step 02 / Curated Desks
              </span>
              <h2 className="font-serif text-3xl font-bold text-ink">
                What belongs in your paper?
              </h2>
              <p className="mt-2 text-[15px] leading-7 text-ink-soft">
                Select as many desks as you like. Custom beats and niche interests are welcome.
              </p>
            </div>
            <InterestSelector
              selected={prefs.interests}
              customInterests={prefs.customInterests}
              customDraft={customDraft}
              onToggle={(slug) => {
                const next = prefs.interests.includes(slug)
                  ? prefs.interests.filter((item) => item !== slug)
                  : [...prefs.interests, slug];
                update({ interests: next });
              }}
              onCustomDraftChange={setCustomDraft}
              onAddCustom={addCustom}
              onRemoveCustom={(value) =>
                update({
                  customInterests: prefs.customInterests.filter(
                    (item) => item !== value,
                  ),
                })
              }
            />
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-8">
            <div>
              <span className="inline-block bg-burgundy/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-burgundy font-semibold">
                Step 03 / Reading Dynamics
              </span>
              <h2 className="font-serif text-3xl font-bold text-ink">
                How should it read?
              </h2>
            </div>

            <PreferenceGroup
              legend="Summaries"
              value={prefs.summaryLength}
              options={[
                {
                  value: "brief",
                  title: "Brief",
                  copy: "A concise 2-sentence briefing — enough to decide whether to open the original.",
                },
                {
                  value: "detailed",
                  title: "Detailed",
                  copy: "A fuller executive recap, closer to a reported summary than a headline.",
                },
              ]}
              onChange={(value) => update({ summaryLength: value as SummaryLength })}
            />

            <PreferenceGroup
              legend="Edition length"
              value={prefs.editionSize}
              options={[
                {
                  value: "short",
                  title: "Short",
                  copy: "A tight morning paper you can finish alongside your morning coffee.",
                },
                {
                  value: "comprehensive",
                  title: "Comprehensive",
                  copy: "More desks, deep reads, and extended column coverage.",
                },
              ]}
              onChange={(value) => update({ editionSize: value as EditionSize })}
            />

            <PreferenceGroup
              legend="Geographic emphasis"
              value={prefs.geographicFocus}
              options={[
                {
                  value: "local",
                  title: "Local Emphasis",
                  copy: "Lead with nearby regional affairs and regional dispatches.",
                },
                {
                  value: "balanced",
                  title: "Balanced",
                  copy: "Home and international affairs in roughly equal measure.",
                },
                {
                  value: "global",
                  title: "Global First",
                  copy: "The world desk leading the front page, with local dispatches following.",
                },
              ]}
              onChange={(value) =>
                update({ geographicFocus: value as GeographicFocus })
              }
            />
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-5">
            <span className="inline-block bg-emerald/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-deep font-semibold">
              Step 04 / Ready for Printing
            </span>
            <h2 className="font-serif text-3xl font-bold text-ink">
              Your edition is folded.
            </h2>
            <p className="max-w-xl text-[15px] leading-7 text-ink-soft">
              {prefs.interests.length + prefs.customInterests.length > 0
                ? `We’ve locked in ${prefs.interests.length + prefs.customInterests.length} beat${
                    prefs.interests.length + prefs.customInterests.length === 1
                      ? ""
                      : "s"
                  } for your morning issue, configured with ${prefs.summaryLength} summaries and a ${prefs.editionSize} paper layout.`
                : "No specific beats selected yet. Your paper will start with general top headlines, which you can personalize anytime."}
            </p>
            <p className="max-w-xl text-[15px] leading-7 text-ink-soft font-mono text-xs bg-paper-deep p-3 border border-rule">
              ✦ Live RSS feeds & Gemini AI ranking are active for your reader profile.
            </p>
          </div>
        ) : null}
      </section>

      {/* Navigation Footer Controls */}
      <div className="mt-12 flex items-center justify-between gap-4 border-t-2 border-ink pt-6">
        <button
          type="button"
          onClick={() => setStep((value) => Math.max(1, value - 1))}
          disabled={step === 1 || isSaving}
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted hover:text-emerald-deep disabled:opacity-30 cursor-pointer transition-colors"
        >
          ← Back
        </button>

        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep((value) => Math.min(4, value + 1))}
            className="inline-flex items-center gap-2 border-2 border-ink bg-ink px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-cream transition-all hover:bg-emerald-deep hover:border-emerald-deep hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            Continue →
          </button>
        ) : (
          <button
            type="button"
            onClick={complete}
            disabled={isSaving}
            className="inline-flex items-center gap-2 border-2 border-ink bg-ink px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-cream transition-all hover:bg-emerald-deep hover:border-emerald-deep hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? "Printing Edition..." : "Open Today’s Paper →"}
          </button>
        )}
      </div>
    </main>
  );
}

function PreferenceGroup({
  legend,
  value,
  options,
  onChange,
}: {
  legend: string;
  value: string;
  options: { value: string; title: string; copy: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted font-bold">
        {legend}
      </legend>
      <div className="grid gap-3 md:grid-cols-2">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <label
              key={option.value}
              className={`group cursor-pointer border-2 p-4 transition-all duration-200 ${
                active
                  ? "border-ink bg-ink text-cream shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  : "border-rule bg-paper-deep/40 text-ink hover:border-emerald-deep hover:bg-emerald-deep hover:text-cream"
              }`}
            >
              <input
                type="radio"
                className="sr-only"
                name={legend}
                value={option.value}
                checked={active}
                onChange={() => onChange(option.value)}
              />
              <span className="font-serif text-lg font-bold block transition-colors">
                {option.title}
              </span>
              <span
                className={`mt-1 block text-[13px] leading-6 transition-colors ${
                  active
                    ? "text-cream/80"
                    : "text-ink-soft group-hover:text-cream/90"
                }`}
              >
                {option.copy}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}