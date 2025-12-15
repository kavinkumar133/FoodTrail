export function showToast(message) {
  try {
    window.dispatchEvent(new CustomEvent('app-toast', { detail: message }));
  } catch (e) {
    console.log('Toast:', message);
  }
}
