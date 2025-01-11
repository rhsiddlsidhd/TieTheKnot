import { AuthCuntomError } from "../../apis/utils/instanceOfAuth";

export const handleError = (
  error: unknown,
  setState: React.Dispatch<React.SetStateAction<string>>
) => {
  if (error instanceof AuthCuntomError) {
    setState(error.message);
    console.error(`AuthCuntomError status: ${error.status}`);
    console.error(`AuthCuntomError message:${error.message}`);
    console.error(`AuthCuntomError name:${error.name}`);
  } else if (error instanceof Error) {
    setState(error.message);
    console.error(`Error name: ${error.name}`);
    console.error(`Error message: ${error.message}`);
  } else {
    console.error(`unknown ${error}`);
  }
};
