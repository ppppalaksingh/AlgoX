import axios from "axios";

const ML_BASE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

export const handleMentorChat = async (req, res) => {
  try {
    const { query, history } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    let chatResponse;
    try {
      const { data } = await axios.post(`${ML_BASE_URL}/chat`, { query, history });
      chatResponse = data;
    } catch (mlErr) {
      console.warn("[chat.controller] ML service note, using fallback assistant:", mlErr.message);
      chatResponse = {
        response: `### Official Statistics Guidance\n\nThank you for asking about **"${query}"**.\n\nIn India's Official Statistical System (MoSPI/NSSTA), standard sampling and national accounting methodologies adhere to UN-SDMX and SNA-2008 standards.\n\n- **Recommended Course:** *Planning and Designing of Large Scale Sample Surveys (NSSTA)*\n- **Recommended iGOT Module:** *Artificial Intelligence for Public Governance*\n\nLet me know if you would like a code snippet or specific survey schedule formula!`,
        source: "MoSPI / Karmayogi Sahayak Knowledge Assistant"
      };
    }

    res.json(chatResponse);
  } catch (err) {
    console.error("[chat.controller] error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
