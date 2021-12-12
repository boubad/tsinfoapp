export interface ICouchDBFindOptions {
  selector: Record<string, unknown>
  limit?: number
  skip?: number
  sort?: Record<string, unknown>[]
  fields?: string[]
  use_index?: string | string[]
  r?: number
  bookmark?: string
  update?: boolean
  stable?: boolean
  stale?: string
  execution_stats?: boolean
}
