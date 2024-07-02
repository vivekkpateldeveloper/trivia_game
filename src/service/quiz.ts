import axios from "axios";
import { getBaseUrl } from "../config";

export const getQuestions = async () => {
  const apiUrl = `${getBaseUrl()}/api.php?amount=${10}`;
  try {
    const response = await axios.get(apiUrl);
    return response?.data;
  } catch (error) {
    return error;
  }
};
