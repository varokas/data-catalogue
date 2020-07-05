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
import { AppBar, Toolbar, Typography, IconButton, InputBase, TableContainer, Table as TableUI, TableBody, TableHead, TableRow, TableCell, Paper } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Menu as MenuIcon, Search as SearchIcon, Link as LinkIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));


function App() {
  const classes = useStyles();

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
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
              {/* <IconButton edge="start" color="inherit" aria-label="menu">
                <MenuIcon />
              </IconButton> */}
              <Typography variant="h6" className={classes.title}>
                <Link to="/" style={{textDecoration: 'none', color: '#fff'}} >
                  Data Catalogue
                </Link>  
              </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
                onChange={(event) => setSearchText(event.target.value)}
              />
            </div>
            {/* <Search display = "if MainPAge"></Search> */}
          </Toolbar>
        </AppBar>
      </div>
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
            {/* Search: <input type="text" value={searhText} onChange={(event) => setSearchText(event.target.value)}/> */}
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

  let filteredColumns = data.columns.filter(column => column.name.toLowerCase().includes(filter !== undefined ? filter.toLowerCase() : ""))
  if (filteredColumns.length == 0) {
    return <div></div>
  }

  return (
    <div>
      <Typography variant="h5">{data.name} <Link to={`/${data.name}`}><LinkIcon/></Link></Typography>
      <p>
        Location: <code style={{ backgroundColor: "#CCCCCC" }}>{data.location.url}</code>
      </p>
      {/* <TableContainer component={Paper}> */}
        <TableUI size="small" aria-label="simple table" style={{width: 0}}>
          <TableHead>
            <TableRow>
              <TableCell style={{minWidth: "100px"}}>Name</TableCell>
              <TableCell style={{minWidth: "100px"}} align="right">Type</TableCell>
              <TableCell style={{minWidth: "300px"}}>Description</TableCell>
              <TableCell style={{minWidth: "100px"}} align="right">Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.columns
              .filter(column => column.name.toLowerCase().includes(filter !== undefined ? filter.toLowerCase() : ""))
              .map(column => (
              <TableRow key={column.name}>
                <TableCell>{column.name}</TableCell>
                <TableCell align="right">{column.type}</TableCell>
                <TableCell>{column.description}</TableCell>
                <TableCell align="right">{column.link}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableUI>
      {/* </TableContainer> */}
    </div>
  );
}

export default App;
