export function formatDateTime(value?: string) {
  if (!value) {
    return 'Time unavailable'
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
