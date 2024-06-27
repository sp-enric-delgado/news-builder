import React from "react";
import {Route, Routes} from 'react-router-dom';
import CanvasSection from "./sections/CanvasSection";
import ProjectSection from "./sections/ProjectSection";
import SpineCanvasSection from "./sections/SpineCanvasSection";

function App(){
  return(
    <div>
      <Routes>
        <Route path="/" exact Component={ProjectSection}/>
        <Route path="/canvas" Component={CanvasSection}/>
        <Route path="/spineCanvas" Component={SpineCanvasSection}/>
      </Routes>
    </div>
  );
}

export default App;