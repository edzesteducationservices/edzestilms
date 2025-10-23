// utils/zoomApi.js
import API from '../LoginSystem/axios';

export const createZoomMeeting = async ({ topic, start_time, duration, agenda }) => {
  try {
    const res = await API.post("/api/zoom/create-meeting", {
      topic,
      start_time,
      duration,
      agenda,
    });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to create Zoom meeting:", err.response?.data || err.message);
    throw err;
  }
};
