import { css, CSSObject, Interpolation } from "styled-components";

type DeviceType = "sm" | "md" | "lg";

const sizes: Record<DeviceType, number> = {
  lg: 1024,
  md: 768,
  sm: 640,
};

const media = Object.entries(sizes).reduce((acc, [key, value]) => {
  return {
    ...acc,
    [key]: (
      first: CSSObject | TemplateStringsArray,
      ...interpolations: Interpolation<Object>[]
    ) => css`
      @media screen and (min-width: ${value}px) {
        ${css(first, ...interpolations)}
      }
    `,
  };
}, {}) as Record<DeviceType, any>;

export { media };
