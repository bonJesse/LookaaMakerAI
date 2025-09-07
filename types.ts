export interface ImageValidationResult {
  isValid: boolean;
  reason: string;
}

export enum AppState {
  UPLOADING,
  VALIDATING,
  SELECTING,
  TRANSFORMING,
  RESULT,
}

export interface Country {
  name: string;
  flag: string;
}

export interface CountriesByContinent {
  [continent: string]: Country[];
}
