import { jest } from "@jest/globals";
import { isVisionModel } from "../app/utils";

describe("isVisionModel", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("should identify vision models using regex patterns", () => {
    const visionModels = [
      "gpt-4.1",
      "claude-3-opus",
      "gemini-2.5-pro",
      "o4-mini",
      "dall-e-3",
      "o1",
    ];

    visionModels.forEach((model) => {
      expect(isVisionModel(model)).toBe(true);
    });
  });

  test("should exclude specific models", () => {
    expect(isVisionModel("claude-3-5-haiku-20241022")).toBe(false);
  });

  test("should not identify non-vision models", () => {
    const nonVisionModels = ["gpt-3.5-turbo", "claude-2", "regular-model"];

    nonVisionModels.forEach((model) => {
      expect(isVisionModel(model)).toBe(false);
    });
  });

  test("should identify models from VISION_MODELS env var", () => {
    process.env.VISION_MODELS = "custom-vision-model,another-vision-model";

    expect(isVisionModel("custom-vision-model")).toBe(true);
    expect(isVisionModel("another-vision-model")).toBe(true);
    expect(isVisionModel("unrelated-model")).toBe(false);
  });

  test("should handle empty or missing VISION_MODELS", () => {
    process.env.VISION_MODELS = "";
    expect(isVisionModel("unrelated-model")).toBe(false);

    delete process.env.VISION_MODELS;
    expect(isVisionModel("unrelated-model")).toBe(false);
    expect(isVisionModel("gpt-4-vision")).toBe(true);
  });
});
