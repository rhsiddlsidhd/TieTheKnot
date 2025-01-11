import { postUploadFiles } from "../apis/api/upload/postUploadFiles";

export const createMaxLengthUrls = (type: string): number => {
  const maxUrls: Record<string, number> = {
    A: 3,
    B: 3,
    C: 4,
    D: 4,
  };
  return maxUrls[type];
};

export const transformFilesToUrls = async (
  files: File[]
): Promise<string[] | void> => {
  try {
    if (!files) {
      throw new Error(`files is ${typeof files}`);
    }
    const _file = [...files];
    let fileUrls: string[] = [];
    for (const file of _file) {
      const fileUrl = await postUploadFiles(file);
      fileUrls.push(fileUrl);
    }

    return fileUrls;
  } catch (error) {
    throw error;
  }
};
