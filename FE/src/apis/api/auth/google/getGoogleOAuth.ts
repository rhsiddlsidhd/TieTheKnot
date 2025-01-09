import authInstance from "../../../utils/instanceOfAuth";

interface ResponseData {
  message: string;
}

//googleOAuth2.0 인증
export const getGoogleOAuth = async (): Promise<ResponseData> => {
  try {
    const res = await authInstance.get(`/auth/authenticate`);

    const data = res.data;
    return data;
  } catch (error) {
    throw error;
  }
};
