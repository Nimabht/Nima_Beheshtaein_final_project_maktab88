const AVERAGE_READING_SPEED = 80;

function formatReadingTime(blocks) {
  let totalWords = 0;
  blocks.forEach((block) => {
    if (block.type === "paragraph") {
      const text = block.data.text || "";
      const words = text.trim().split(/\s+/).length;
      totalWords += words;
    }
  });

  const averageTime = totalWords / AVERAGE_READING_SPEED;

  if (averageTime < 1) {
    const seconds = Math.round(averageTime * 60);
    return `${seconds} sec`;
  } else if (averageTime < 120) {
    const minutes = Math.round(averageTime);
    return `${minutes} min`;
  } else {
    const hours = Math.floor(averageTime / 60);
    return `${hours} hours`;
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const currentYear = new Date().getFullYear();
  if (date.getFullYear() === currentYear) {
    const formattedDate = date.toLocaleString("default", {
      month: "short",
      day: "numeric",
    });
    return formattedDate;
  } else {
    const formattedDate = date.toLocaleString("default", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return formattedDate;
  }
}
