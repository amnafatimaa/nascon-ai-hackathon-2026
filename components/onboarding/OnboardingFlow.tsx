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
      // 1. Write user preferences payload to Supabase user_preferences table
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
      // 2. Persist locally and navigate
      saveOnboardingPreferences({ ...prefs, completed: true });
      setIsSaving(false);
      router.push("/paper");
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-12 md:px-8 md:py-16">
      <p className="text-[11px] uppercase tracking-[0.22em] text-burgundy">
        Compose your paper
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
        A few choices before the press run.
      </h1>
      <p className="mt-4 max-w-xl text-[15px] leading-7 text-ink-soft">
        Selections stay on this device and sync to your reader profile.
      </p>

      <div className="mt-10">
        <ProgressRail step={step} total={4} labels={STEPS} />
      </div>

      <section className="mt-10 min-h-[280px]">
        {step === 1 ? (
          <div className="space-y-5">
            <h2 className="font-serif text-3xl">Welcome to the composing room.</h2>
            <p className="max-w-xl text-[15px] leading-7 text-ink-soft">
              DAYBREAK is being built as a morning newspaper that learns what you
              care about, then sets those stories in type. This first version
              records your interests so later editions can be ranked, not so an
              algorithm can pretend to be finished.
            </p>
            <p className="max-w-xl text-[15px] leading-7 text-ink-soft">
              You can skip this and still read today’s sample edition. The paper
              will simply remain general until you return.
            </p>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-3xl">What belongs in your paper?</h2>
              <p className="mt-3 text-[15px] leading-7 text-ink-soft">
                Select as many desks as you like. Custom beats are welcome.
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
            <h2 className="font-serif text-3xl">How should it read?</h2>
            <PreferenceGroup
              legend="Summaries"
              value={prefs.summaryLength}
              options={[
                {
                  value: "brief",
                  title: "Brief",
                  copy: "A few sentences — enough to decide whether to open the original.",
                },
                {
                  value: "detailed",
                  title: "Detailed",
                  copy: "A fuller briefing, closer to a reported recap than a headline.",
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
                  copy: "A tight morning paper you can finish with coffee.",
                },
                {
                  value: "comprehensive",
                  title: "Comprehensive",
                  copy: "More desks, more columns, a longer sit.",
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
                  title: "Local",
                  copy: "Lead with nearby affairs, including Pakistan when it is on the docket.",
                },
                {
                  value: "balanced",
                  title: "Balanced",
                  copy: "Home and abroad in roughly equal measure.",
                },
                {
                  value: "global",
                  title: "Global",
                  copy: "The world desk first; local news as a letter from home.",
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
            <h2 className="font-serif text-3xl">The sample edition is set.</h2>
            <p className="max-w-xl text-[15px] leading-7 text-ink-soft">
              {prefs.interests.length + prefs.customInterests.length > 0
                ? `We’ll keep ${prefs.interests.length + prefs.customInterests.length} interest${
                    prefs.interests.length + prefs.customInterests.length === 1
                      ? ""
                      : "s"
                  } on this device, with ${prefs.summaryLength} summaries and a ${prefs.editionSize} paper.`
                : "You did not name interests yet. The sample paper remains general, and you can return anytime."}
            </p>
            <p className="max-w-xl text-[15px] leading-7 text-ink-soft">
              Live ingestion and ranking are connected to your database preferences.
            </p>
          </div>
        ) : null}
      </section>

      <div className="mt-12 flex items-center justify-between gap-4 border-t border-rule pt-6">
        <button
          type="button"
          onClick={() => setStep((value) => Math.max(1, value - 1))}
          disabled={step === 1 || isSaving}
          className="text-[12px] uppercase tracking-[0.16em] text-muted disabled:opacity-30"
        >
          Back
        </button>
        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep((value) => Math.min(4, value + 1))}
            className="border border-ink bg-ink px-5 py-2.5 text-[12px] uppercase tracking-[0.18em] text-cream"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={complete}
            disabled={isSaving}
            className="border border-burgundy bg-burgundy px-5 py-2.5 text-[12px] uppercase tracking-[0.18em] text-cream disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Open today’s paper"}
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
    <fieldset>
      <legend className="text-[11px] uppercase tracking-[0.18em] text-muted">
        {legend}
      </legend>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <label
              key={option.value}
              className={`cursor-pointer border p-4 ${
                active ? "border-ink bg-cream" : "border-rule bg-transparent"
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
              <span className="font-serif text-xl">{option.title}</span>
              <span className="mt-2 block text-[13px] leading-6 text-muted">
                {option.copy}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}