export interface Catalogue {
  tables: Table[];
}

export interface Table {
  name: string
  location: S3Location
  storedFormat: StoredFormat
  columns: Column[]
  sample?: Sample
}

export interface Column {
  name: string
  type: ColumnType
  description?: string
  link?: String
}

interface Sample {
  header: string[]
  rows: string[][]
}

interface S3Location {
  url: string
}

interface StoredFormat {
  type: string
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


//https://github.com/yugabyte/yugabyte-db/blob/master/sample/clubdata_ddl.sql

function col(name: string, type: ColumnType, description?: string, link?: String):Column {
    return { name: name, type: type, description: description, link: link }
  }
let catalogue: Catalogue = {
    tables: [
      {
        name: "facilities",
        location: { url: "s3://mydata/facility" },
        storedFormat: { type: "parquet "},
        columns: [
          col("facid", ColumnType.Integer),
          col("name", ColumnType.String),
          col("membercost", ColumnType.Double),
          col("guestcost", ColumnType.Double),
          col("initialoutlay", ColumnType.Integer),
          col("monthlymaintenance", ColumnType.Double)
        ]
      },
      {
        name: "members",
        location: { url: "s3://mydata/members" },
        storedFormat: { type: "parquet "},
        columns: [
          col("memid", ColumnType.Integer),
          col("surname", ColumnType.String),
          col("firstname", ColumnType.String),
          col("address", ColumnType.String),
          col("zipcode", ColumnType.Integer),
          col("telephone", ColumnType.String),
          col("recommendedby", ColumnType.Double, "Recommend by which member", "members:memid"),
          col("joindate", ColumnType.Timestamp),
        ]
      },
      {
        name: "bookings",
        location: { url: "s3://mydata/bookings" },
        storedFormat: { type: "parquet "},
        columns: [
          col("bookid", ColumnType.Integer),
          col("facid", ColumnType.Integer, "Facility", "factilities::facid"),
          col("memid", ColumnType.Integer, "Member", "members::memid"),
          col("starttime", ColumnType.Timestamp),
          col("slots", ColumnType.Integer),
        ]
      }
    ]
  }