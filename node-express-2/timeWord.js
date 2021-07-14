const ones = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const tens = ["twen", "thir", "four", "fif", "six", "seven", "eigh", "nine"];

function num2Word(num) {
  const onesDigit = num%10;
  const tensDigit = Math.floor(num/10);

  if (num < 10) return ones[num];
  if (num < 13) return ["ten", "eleven", "twelve"][num-10];
  if (num < 20) return `${tens[onesDigit-2]}teen`;
  return `${tens[tensDigit-2]}ty${onesDigit ? ` ${ones[onesDigit]}`: ""}`;
}

function timeWord(timeStr) {
  const hours = Number(timeStr.substring(0,2));
  const minutes = Number(timeStr.substring(3));

  // Special format for 12 am and pm
  if (minutes === 0) {
    if (hours === 0) return "midnight";
    if (hours === 12) return "noon";
  }

  /** Format: <hour> <minute> <a/p>m
  *
  * Minutes special formating:
  *   "o'clock" if 0
  *   "oh <number>" if less than 10
  */
  return `${hours%12 === 0 ? "twelve" : num2Word(hours%12)} ${minutes===0 ? "o'clock" : `${minutes<10 ? "oh ":""}${num2Word(minutes)}`} ${hours/12 < 1 ? "a":"p"}m`
}

module.exports = { timeWord };