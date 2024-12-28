import subway from "../../../utils/instanceOfSubway";
import { SearchInfoBySubwayNameService } from "./types";

const getAllSubwayStationApi = async (): Promise<
  SearchInfoBySubwayNameService[]
> => {
  try {
    const startIndex = 1;
    const endIndex = 1000;
    const res = await subway.get(`${startIndex}/${endIndex}/ `);
    const data = res.data.SearchInfoBySubwayNameService.row;
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export default getAllSubwayStationApi;
