export function formatDate(isoDateString) {
  const date = new Date(isoDateString);

  // Use toLocaleString for customizable output
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    hour12: true,
  };

  return date.toLocaleString("en-US", options);
}
