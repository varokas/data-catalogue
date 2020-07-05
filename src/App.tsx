import React, { useState, useEffect } from 'react';
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
  const [searhText, setSearchText] = useState("")
  const [catalogue, setCatalogue] = useState<Catalogue>({tables: []})

  useEffect(
    () => {
      fetch("/catalogue.json")
      .then(response => response.json())
      .then(responseJson => setCatalogue(responseJson))
  }, [])

  return (
    <Router>
      <Link to="/">Home</Link>
      <ul>
        { 
          catalogue.tables.map( table => <li key={table.name}><Link to={`/${table.name}`}>{table.name}</Link></li>)
        }
      </ul>
      <hr/>
      <Switch>
        <Route path="/:tableName" children={<TablePage data={catalogue}/>} />
        <Route path="/" children={
          <div>
            <h1>Catalogue</h1>
            Search: <input type="text" value={searhText} onChange={(event) => setSearchText(event.target.value)}/>
            { catalogue.tables.map(table => <TableView key={table.name} data={table} filter={searhText} />)}
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
        <tbody>
          {data.columns
            .filter(column => column.name.includes(filter !== undefined ? filter : ""))
            .map(column => (
            <tr key={column.name}>
              <td>{column.name}</td>
              <td>{column.type}</td>
              <td>{column.description}</td>
              <td>{column.link}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
