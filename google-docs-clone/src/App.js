import './App.css';
import Docs from './components/docs';
import EditDocs from './components/EditDocs';
import {app, database } from './firebaseConfig';
import { Routes, Route } from "react-router-dom";

function App(){
  return (
    <Routes>
        <Route path="/" element={<Docs database={database}/>}/>
        <Route path="/editDocs/:id" element={<EditDocs database={database}/>} />
    </Routes>
    );
}

export default App;
