import type { ArticleFeedbackMap, OnboardingPreferences } from "./types";

export const ONBOARDING_STORAGE_KEY = "daybreak.onboarding.v1";
export const FEEDBACK_STORAGE_KEY = "daybreak.article-feedback.v1";

export const defaultPreferences: OnboardingPreferences = {
  interests: [],
  customInterests: [],
  summaryLength: "brief",
  editionSize: "short",
  geographicFocus: "balanced",
  completed: false,
  updatedAt: "",
};

function canUseStorage() {
  return typeof window !== "undefined";
}

function readOnboarding(): OnboardingPreferences {
  if (!canUseStorage()) return defaultPreferences;

  try {
    const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return defaultPreferences;
    const parsed = JSON.parse(raw) as Partial<OnboardingPreferences>;
    return {
      ...defaultPreferences,
      ...parsed,
      interests: parsed.interests ?? [],
      customInterests: parsed.customInterests ?? [],
    };
  } catch {
    return defaultPreferences;
  }
}

function readFeedback(): ArticleFeedbackMap {
  if (!canUseStorage()) return {};

  try {
    const raw = window.localStorage.getItem(FEEDBACK_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ArticleFeedbackMap) : {};
  } catch {
    return {};
  }
}

let onboardingSnapshot = defaultPreferences;
let feedbackSnapshot: ArticleFeedbackMap = {};
const onboardingListeners = new Set<() => void>();
const feedbackListeners = new Set<() => void>();
let memoryHydrated = false;

function hydrateFromStorage() {
  if (!canUseStorage() || memoryHydrated) return;
  onboardingSnapshot = readOnboarding();
  feedbackSnapshot = readFeedback();
  memoryHydrated = true;
}

export function subscribeOnboarding(listener: () => void) {
  hydrateFromStorage();
  onboardingListeners.add(listener);
  return () => {
    onboardingListeners.delete(listener);
  };
}

export function getOnboardingSnapshot() {
  hydrateFromStorage();
  return onboardingSnapshot;
}

export function getOnboardingServerSnapshot() {
  return defaultPreferences;
}

export function saveOnboardingPreferences(value: OnboardingPreferences) {
  onboardingSnapshot = {
    ...value,
    updatedAt: new Date().toISOString(),
  };
  if (canUseStorage()) {
    window.localStorage.setItem(
      ONBOARDING_STORAGE_KEY,
      JSON.stringify(onboardingSnapshot),
    );
  }
  onboardingListeners.forEach((listener) => listener());
}

export function subscribeFeedback(listener: () => void) {
  hydrateFromStorage();
  feedbackListeners.add(listener);
  return () => {
    feedbackListeners.delete(listener);
  };
}

export function getFeedbackSnapshot() {
  hydrateFromStorage();
  return feedbackSnapshot;
}

export function getFeedbackServerSnapshot(): ArticleFeedbackMap {
  return {};
}

export function saveArticleFeedback(value: ArticleFeedbackMap) {
  feedbackSnapshot = value;
  if (canUseStorage()) {
    window.localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(value));
  }
  feedbackListeners.forEach((listener) => listener());
}
