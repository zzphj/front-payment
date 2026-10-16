export const logger = {
  warn(message: string): void {
    console.warn(message)
  },
  error(message: string, detail?: unknown): void {
    console.error(message, detail)
  },
}
