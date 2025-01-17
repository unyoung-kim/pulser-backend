import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import pThrottle from "p-throttle";

// Considering maximum max_tokens/LLM call is 10,000 and one call may take 1-2 minutes, so TPM / (10,000 * 2)
const maxConcurrentCallToGPT4o: number = 100; // TPM: 2,000,000
const maxConcurrentCallToGPT4oMini: number = 500; // TPM: 10,000,000
const maxConcurrentCallToGPTo1Mini: number = 500; // TPM: 10,000,000
const maxConcurrentCallToGPT4oPreview: number = 100; // TPM: 2,000,000
const maxConcurrentCallToClaudeSonnet3_5: number = 1; // TPM: 16,000

export function getGPT4o() {
  return openai("gpt-4o-2024-11-20");
}

export function getGPT4oMini() {
  return openai("gpt-4o-mini-2024-07-18");
}

export function getGPTo1Mini() {
  return openai("o1-mini-2024-09-12");
}

export function getGPTo1Preview() {
  return openai("o1-preview");
}

export function getClaudeSonnet() {
  return anthropic("claude-3-5-sonnet-20240620");
}

export function getFineTunedGPT4o() {
  return openai("ft:gpt-4o-2024-08-06:personal::Aoh3T16f");
}

export const getThrottledGPT4o = pThrottle({
  limit: maxConcurrentCallToGPT4o,
  interval: 60 * 1000,
})(getGPT4o);

export const getThrottledGPT4oMini = pThrottle({
  limit: maxConcurrentCallToGPT4oMini,
  interval: 60 * 1000,
})(getGPT4oMini);

export const getThrottledGPTo1Mini = pThrottle({
  limit: maxConcurrentCallToGPTo1Mini,
  interval: 60 * 1000,
})(getGPTo1Mini);

export const getThrottledGPTo1Preview = pThrottle({
  limit: maxConcurrentCallToGPT4oPreview,
  interval: 60 * 1000,
})(getGPTo1Preview);

export const getThrottledClaudeSonnet = pThrottle({
  limit: maxConcurrentCallToClaudeSonnet3_5,
  interval: 60 * 1000,
})(getClaudeSonnet);

export const getThrottledFineTunedGPT4o = pThrottle({
  limit: maxConcurrentCallToGPT4o,
  interval: 60 * 1000,
})(getFineTunedGPT4o);
