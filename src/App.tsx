import React, { useState } from 'react';
import './App.css';

import {Catalogue, Column, ColumnType, Table} from './data';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

function App() {
  const [searhText, setSearchText] = useState("");

  return (
    <Router>
      <Link to="/">Home</Link>
      <ul>
        { 
          catalogue.tables.map( table => <li><Link to={`/${table.name}`}>{table.name}</Link></li>)
        }
      </ul>
      <hr/>
      <Switch>
        <Route path="/:tableName" children={<TablePage data={catalogue}/>} />
        <Route path="/" children={
          <div>
            <h1>Catalogue</h1>
            Search: <input type="text" value={searhText} onChange={(event) => setSearchText(event.target.value)}/>
            { catalogue.tables.map(table => <TableView data={table} filter={searhText} />)}
          </div>
        }/>
      </Switch>
    </Router>
  );
}

type TablePageProps = {
  data: Catalogue
}
function TablePage({data}:TablePageProps) {
  let { tableName } = useParams();

  let table = data.tables.find( t => t.name === tableName)

  return (
    <TableView data={table}/>
  );
}

type TableViewProps = {
  filter?: string
  data?: Table
}
function TableView({data, filter}: TableViewProps) {
  if (data === undefined) {
    return <div></div>
  }

  return (
    <div>
      <h2><Link to={`/${data.name}`}>{data.name}</Link></h2>
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Type</td>
            <td>Description</td>
            <td>Link</td>
          </tr>
        </thead>
        {data.columns
          .filter(column => column.name.includes(filter !== undefined ? filter : ""))
          .map(column => (
          <tr>
            <td>{column.name}</td>
            <td>{column.type}</td>
            <td>{column.description}</td>
            <td>{column.link}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}

function col(name: String, type: ColumnType, description?: String, link?: String):Column {
  return { name: name, type: type, description: description, link: link }
}

//https://github.com/yugabyte/yugabyte-db/blob/master/sample/clubdata_ddl.sql
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

export default App;
