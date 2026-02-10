const bsAsFormatter = new Intl.DateTimeFormat("es-AR", {
  timeZone: "America/Argentina/Buenos_Aires",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

export function formatBsAsDateTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return bsAsFormatter.format(date);
}

export function toDateTimeLocalValue(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

export function toISOStringFromLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  return date.toISOString();
}

export function formatDistance(km) {
  return km.toFixed(2);
}
