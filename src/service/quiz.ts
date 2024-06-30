import axios from "axios";
import { getBaseUrl } from "../config";

export const getQuestions = async () => {
  const apiUrl = `${getBaseUrl()}/api.php?amount=${5}`;
  try {
    const response = await axios.get(apiUrl);
    return response?.data;
  } catch (error) {
    return error;
  }
};
