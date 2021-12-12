//
export interface ICouchDBDoc {
  _id: string
  _rev: string
  _deleted?: boolean
  _attachments?: Record<string, unknown>
  _conflicts?: Record<string, unknown>[]
  _deleted_conflicts?: Record<string, unknown>[]
  _local_seq?: string
  _revs_info?: Record<string, unknown>[]
  _revisions?: Record<string, unknown>
  [propname: string]: unknown
}
