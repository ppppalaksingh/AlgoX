import axios from "axios";

const ML_BASE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

export const getGapAnalysis = async (userProfile) => {
  const { data } = await axios.post(`${ML_BASE_URL}/gap-analysis`, userProfile);
  return data;
};

export const getRecommendations = async (gapProfile) => {
  const { data } = await axios.post(`${ML_BASE_URL}/recommendations`, gapProfile);
  return data;
};

export const generateQuiz = async (fileText) => {
  const { data } = await axios.post(`${ML_BASE_URL}/generate-quiz`, { text: fileText });
  return data;
};