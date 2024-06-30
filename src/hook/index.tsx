import axios from "axios";

export async function useGetApi(url: string) {
  try {
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error;
  }
}
