import { ComponentSize } from "../models/shared-props";

export const getWidth = (componentWidth?: ComponentSize): string => {
  switch (componentWidth) {
    case ComponentSize.Small:
      return "w-16";
    case ComponentSize.Medium:
      return "w-32";
    case ComponentSize.Large:
      return "w-56";
    default:
      return "w-56";
  }
};
