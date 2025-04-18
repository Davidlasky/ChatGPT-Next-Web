import { useMemo } from "react";
import { useAccessStore, useAppConfig } from "../store";
import { collectModelsWithDefaultModel } from "./model";
import { ServiceProvider } from "../constant";

// Define the allowed providers
const allowedProviders = [
  ServiceProvider.OpenAI,
  ServiceProvider.Google,
  ServiceProvider.Anthropic,
];

export function useAllModels() {
  const accessStore = useAccessStore();
  const configStore = useAppConfig();
  const models = useMemo(() => {
    // First, collect all models including custom ones
    const allModels = collectModelsWithDefaultModel(
      configStore.models,
      [configStore.customModels, accessStore.customModels].join(","),
      accessStore.defaultModel,
    );

    // Then, filter the collected models based on the allowed providers
    return allModels.filter(
      (model) =>
        model.provider &&
        allowedProviders.includes(
          model.provider.providerName as ServiceProvider,
        ),
    );
  }, [
    accessStore.customModels,
    accessStore.defaultModel,
    configStore.customModels,
    configStore.models,
  ]);

  return models;
}
