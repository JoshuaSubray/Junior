// Input/Output and JSON validation.

/**
 * Reads save data from localStorage and prompts the user to download it as a JSON file.
 * Returns true if successful, false if there was an error or no data.
 */
export function downloadSaveData(storageKey: string = 'junior_grade_calculator_data'): boolean {
  const dataStr = localStorage.getItem(storageKey);
  if (dataStr) {
    try {
      const parsed = JSON.parse(dataStr);
      const formattedStr = JSON.stringify(parsed, null, 2);
      const blob = new Blob([formattedStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'JUNIOR_SAVE.json';
      a.click();
      URL.revokeObjectURL(url);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Opens a file picker to select a JSON save file and reads its content.
 * Calls the onLoad callback with the string content of the file.
 */
export function promptLoadSaveData(onLoad: (content: string) => void) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          onLoad(content);
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
}