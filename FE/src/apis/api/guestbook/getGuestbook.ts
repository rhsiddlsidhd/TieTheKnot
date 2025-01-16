import axios from "axios";

export const getGuestbook = async (id: string, page: number) => {
  try {
    const res = await axios.get("http://localhost:8080/book", {
      params: {
        page,
        limit: 5,
        id,
      },
    });

    const data = res.data;
    return data;
    // setGuestbook((prev) => [...prev, ...data]);
    // pageRef.current += 1;
    // setMore(hasMore);
  } catch (error) {
    console.error(error);
  }
};
