import React from "react";
import {Route, Routes} from 'react-router-dom';
import CanvasSection from "./sections/CanvasSection";
import ProjectSection from "./sections/ProjectSection";

function App(){
  return(
    <div>
      <Routes>
        <Route path="/" exact Component={ProjectSection}/>
        <Route path="/canvas" Component={CanvasSection}/>
      </Routes>
    </div>
  );
}

export default App;