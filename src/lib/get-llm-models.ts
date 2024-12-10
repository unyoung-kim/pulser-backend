import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import pThrottle from "p-throttle";

const maxConcurrentCallToGPT4o: number = 3; // TPM: 30,000
const maxConcurrentCallToGPT4oMini: number = 20; // TPM: 200,000
const maxConcurrentCallToGPT4oPreview: number = 2; // TPM: 30,000
const maxConcurrentCallToClaudeSonnet3_5: number = 2; // TPM: 16,000

const getGPT4o20241120 = () => {
  return openai("gpt-4o-2024-11-20");
};

const getGPToMini = () => {
  return openai("gpt-4o-mini");
};

const getGPTo1Preview = () => {
  return openai("o1-preview");
};

const getCaludeSonnet20241022 = () => {
  return anthropic("claude-3-5-sonnet-20241022");
};

const getCaludeSonnet20240620 = () => {
  return anthropic("claude-3-5-sonnet-20240620");
};

export const getThrottledGPT4o20241120 = pThrottle({
  limit: maxConcurrentCallToGPT4o,
  interval: 1000,
})(getGPT4o20241120);

export const getThrottledGPToMini = pThrottle({
  limit: maxConcurrentCallToGPT4oMini,
  interval: 1000,
})(getGPToMini);

export const getThrottledGPTo1Preview = pThrottle({
  limit: maxConcurrentCallToGPT4oPreview,
  interval: 1000,
})(getGPTo1Preview);

export const getThrottledCaludeSonnet20241022 = pThrottle({
  limit: maxConcurrentCallToClaudeSonnet3_5,
  interval: 1000,
})(getCaludeSonnet20241022);

export const getThrottledCaludeSonnet20240620 = pThrottle({
  limit: maxConcurrentCallToClaudeSonnet3_5,
  interval: 1000,
})(getCaludeSonnet20240620);
