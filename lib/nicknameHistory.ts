const NICKNAME_HISTORY_KEY = 'online-cafe-nickname-history';
const MAX_HISTORY = 5;

export function saveNicknameToHistory(nickname: string): void {
  const trimmed = nickname.trim();
  if (!trimmed) return;

  const history = loadNicknameHistory();
  const filtered = history.filter((n) => n !== trimmed);
  const updated = [trimmed, ...filtered].slice(0, MAX_HISTORY);
  localStorage.setItem(NICKNAME_HISTORY_KEY, JSON.stringify(updated));
}

export function loadNicknameHistory(): string[] {
  try {
    const raw = localStorage.getItem(NICKNAME_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((n) => typeof n === 'string')) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

export const SUGGESTED_NICKNAMES = [
  '따뜻한라떼',
  '바쁜바리스타',
  '창가의고양이',
  '공부하는책',
  '일하는다람쥐',
  '쉬어가는손님',
  '깊은생각',
  '노을지는테라스',
];
