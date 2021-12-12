export interface ICouchDBFindResponse<T> {
  docs?: T[]
  warning?: string
  execution_stats?: Record<string, unknown>
  bookmark?: string
}
