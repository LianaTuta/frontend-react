export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  };

  export function formatCountdown(milliseconds) {
    if (milliseconds <= 0) return "00:00";
  
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
  
    const pad = (num) => String(num).padStart(2, "0");
  
    return `${pad(minutes)}:${pad(seconds)}`;
  }