export interface Catalogue {
  tables: Table[];
}

export interface Table {
  name: String
  location: Location
  storedFormat: StoredFormat
  columns: Column[]
  sample?: Sample
}

export interface Column {
  name: String
  type: ColumnType
  description?: String
  link?: String
}

interface Sample {
  header: String[]
  rows: String[][]
}

interface Location {
}

interface S3Location extends Location {
  url: String
}

interface StoredFormat {
  type: String
}

interface ParquetStoredFormat extends StoredFormat {
  partitions: Column[]
}

export enum ColumnType {
  String = "String",
  Double = "Double",
  Long = "Long",
  Integer = "Integer",
  Timestamp = "Timestamp"
}