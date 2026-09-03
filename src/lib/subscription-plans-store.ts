import { platformSubscriptionPlans, type PlatformSubscriptionPlan } from "@/lib/platform-data";

const STORAGE_KEY = "lexarox-subscription-plans";

export function getSubscriptionPlans(): PlatformSubscriptionPlan[] {
  if (typeof sessionStorage === "undefined") return platformSubscriptionPlans;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as PlatformSubscriptionPlan[];
  } catch {
    /* ignore */
  }
  return platformSubscriptionPlans;
}

export function setSubscriptionPlans(plans: PlatformSubscriptionPlan[]) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

export function addSubscriptionPlan(plan: PlatformSubscriptionPlan) {
  setSubscriptionPlans([plan, ...getSubscriptionPlans()]);
}
