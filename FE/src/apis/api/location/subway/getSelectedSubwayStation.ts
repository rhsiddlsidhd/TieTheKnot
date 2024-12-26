import subway from "../../../utils/instanceOfSubway";
import { SearchInfoBySubwayNameService } from "./types";

const getSelectedSubwayStation = async (
  props: string
): Promise<SearchInfoBySubwayNameService[]> => {
  try {
    const res = await subway.get(`1/5/${props}`);
    const data = res.data.SearchInfoBySubwayNameService.row;

    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export default getSelectedSubwayStation;
