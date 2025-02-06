import { WeddingDay } from "../pages/Main";

export interface ThumnnailProps {
  weddingDay: WeddingDay;
  weddingTime: { hours: number; minutes: number };
  weddingData: any;
}
export type Lang = "kr" | "eng";

export type DayOfLang = {
  [key in Lang]: string;
};

export type ImgProps = {
  src: string;
  alt?: string;
  width?: string;
  height?: string;
  rounded?: string;
};
