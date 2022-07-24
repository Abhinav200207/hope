import './App.css';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ServiceCommandUnit from "./ServiceCommandUnit.jsx";
import React, { useEffect, useState } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { static_items } from './data.jsx'
import AssignmentIndSharpIcon from '@mui/icons-material/AssignmentIndSharp';
import EventAvailableSharpIcon from '@mui/icons-material/EventAvailableSharp';
import MoreHorizSharpIcon from '@mui/icons-material/MoreHorizSharp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloseIcon from '@mui/icons-material/Close';
import DriveFileRenameOutlineSharpIcon from '@mui/icons-material/DriveFileRenameOutlineSharp';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
// import { borderBottom } from '@mui/system';


function countEle(arr, ele) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === ele) return true;
  }
  return false;
}


const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  marginTop: "1px",

  // change background colour if dragging
  background: isDragging ? "none" : "white",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "floralwhite" : "floralwhite",
  padding: grid,
});

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}



function App() {
  const [data, setData] = useState([]);
  const [create, setCreate] = useState(false);
  const [subcreate, setSubCreate] = useState(false);
  const [task, setTask] = useState("");
  const [subtask, setSubTask] = useState("");
  const [indexforcreatingSubtask, setIndexforcreatingSubtask] = useState(-1);
  const [open, setOpen] = useState([])



  useEffect(() => {
    setData(static_items);
  }, [])

  const onDragEnd = (result) => {
    // dropped outside the list
    console.log(result);
    console.log("innner drag");
    if (!result.destination) {
      return;
    }


    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;


    if (result.type === "droppableItem") {
      const items = reorder(data, sourceIndex, destIndex);

      setData(items);
    } else if (result.type === "droppableSubItem") {



      console.log(data);

      const itemSubItemMap = data.reduce((acc, item) => {
        acc[item.id] = item.subItems;
        return acc;
      }, {});

      // console.log(itemSubItemMap);

      const sourceParentId = parseInt(result.source.droppableId);
      const destParentId = parseInt(result.destination.droppableId);

      const sourceSubItems = itemSubItemMap[sourceParentId];
      const destSubItems = itemSubItemMap[destParentId];

      let newItems = [...data];

      /** In this case subItems are reOrdered inside same Parent */
      if (sourceParentId === destParentId) {
        const reorderedSubItems = reorder(
          sourceSubItems,
          sourceIndex,
          destIndex
        );
        newItems = newItems.map(item => {
          if (parseInt(item.id) === sourceParentId) {
            item.subItems = reorderedSubItems;
          }
          return item;
        });
        setData(newItems);



      } else {
        console.log(newItems);
        let newSourceSubItems = [...sourceSubItems];
        const [draggedItem] = newSourceSubItems.splice(sourceIndex, 1);

        let newDestSubItems = [...destSubItems];
        newDestSubItems.splice(destIndex, 0, draggedItem);
        newItems = newItems.map(item => {
          if (parseInt(item.id) === sourceParentId) {
            item.subItems = newSourceSubItems;
          } else if (parseInt(item.id) === destParentId) {
            item.subItems = newDestSubItems;
          }
          return item;
        });
        setData(newItems);
      }
    }
  }

  const handleNewTask = () => {
    setCreate(true);
  }

  const handleCreateNewTask = () => {
    let idindata = parseInt(data[0].id);
    for (let i = 0; i < data.length; i++) {
      idindata = Math.max(idindata, parseInt(data[i].id));
    }
    const finaldata = [...data, {
      id: (idindata + 1).toString(),
      content: task,
      subItems: []
    }]
    setData(finaldata)
    setCreate(false);
  }

  const handleStartCreateNewSubTask = (i) => {
    setIndexforcreatingSubtask(parseInt(i));
    setSubCreate(true);
  }

  const handleCreateNewSubTask = (i) => {
    i = parseInt(i);

    let datatobechanged = [...data];
    let idindata;
    let indexInner;

    for (let j = 0; j < data.length; j++) {
      if (parseInt(data[j].id) === i) {
        indexInner = j;
        break;
      }
    }

    if (datatobechanged[indexInner].subItems.length !== 0) {
      idindata = parseInt(datatobechanged[indexInner].subItems[0].id);
      for (let j = 0; j < datatobechanged[indexInner].subItems.length; j++) {
        idindata = Math.max(idindata, parseInt(datatobechanged[indexInner].subItems[j].id));
      }

    } else {
      idindata = randomNumber(1000, 1000000);
    }

    datatobechanged[indexInner].subItems = [...datatobechanged[indexInner].subItems, {
      id: (idindata + 1).toString(),
      content: subtask
    }];
    setData(datatobechanged);

    setSubCreate(false);
  }

  const handleOpenSubTask = (i) => {
    if (countEle(open, parseInt(i))) {
      let l = [...open];
      const index = l.indexOf(parseInt(i));
      if (index > -1) {
        l.splice(index, 1);
      }
      setOpen(l);
    }
    else {
      setOpen([...open, parseInt(i)]);
    }
  }





  return (
    <div className="super-main-container">
      <div className="App">

        <DragDropContext onDragEnd={onDragEnd}>


          <div className="main-container">



            <Droppable droppableId="droppable_abhinav" type="droppableItem">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {data.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div>
                          <div
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >

                            {snapshot.isDragging === false ? (
                              <div style={{ "marginTop": "0px", "boxShadow": "0 0 3px rgba(0, 0, 0, 0.400)", "width": "100%", "height": "1px" }}></div>
                            ) : (<div></div>)}
                            <div className="inside-dragable">

                              <div className='inside-card1'>
                                {item.subItems.length ? (
                                  < div className="arrow-right-dir" style={{ "transform": `${countEle(open, parseInt(item.id)) ? "rotate(90deg)" : "rotate(0deg)"}` }} onClick={() => handleOpenSubTask(item.id)}><ArrowRightIcon /></div>
                                ) : (<div style={{ "width": "24px", "height": "10px" }}></div>)}
                                <div className="tick"><DoneIcon style={{ "color": "black", "fontWeight": "bold", "height": "17px" }} /></div>

                                <div style={{ "marginLeft": "10px", "color": "black" }} >{item.content}</div>

                                <div className="subtask-icon" style={{ "border": "1px solid black", "marginLeft": "10px", "height": "16px", "borderRadius": "4px", "display": "flex", "alignItems": "center", "justifyContent": "center" }} onClick={() => handleStartCreateNewSubTask(item.id)}><AssignmentIcon style={{ "height": "14px" }} /></div>
                                <div className="rename-icon" style={{ "border": "1px solid black", "marginLeft": "6px", "height": "16px", "borderRadius": "4px", "display": "flex", "alignItems": "center", "justifyContent": "center" }}><DriveFileRenameOutlineSharpIcon style={{ "height": "14px" }} /></div>
                                <div className="edit-task-icon" style={{ "border": "1px solid black", "marginLeft": "6px", "height": "16px", "borderRadius": "4px", "display": "flex", "alignItems": "center", "justifyContent": "center" }}><EditIcon style={{ "height": "14px" }} /></div>
                              </div>

                              <div className='inside-card2'>
                                <div className="assign-icon"><AssignmentIndSharpIcon style={{ "height": "20px" }} /></div>
                                <div className="due-data"><EventAvailableSharpIcon style={{ "height": "20px" }} /></div>
                                <div className="three-dots"><MoreHorizSharpIcon style={{ "height": "20px" }} /></div>
                              </div>
                            </div>







                            {parseInt(item.id) === indexforcreatingSubtask ? (
                              <div className='input-subtask-box' style={{ "display": `${(subcreate === false) ? "none" : "flex"}` }}>


                                <div className='input-subtask-left'>
                                  <DoneIcon style={{ "height": "20px","color":"black" }} />
                                  <input type="text" style={{ "outline": "none","border":"none","fontSize":"13px","marginLeft":"10px" }} placeholder="Type '/' for commands" onChange={(e) => {
                                    setSubTask(e.target.value);
                                  }} />
                                </div>

                                <div className='input-subtask-right'>
                                  <div style={{"fontSize":"12px","paddingBottom":"4px"}}>ctrl+entr to open</div>
                                  <div style={{"marginRight":"2px"}} className='assign-icon'><AssignmentIndSharpIcon style={{ "height": "18px" }} /></div>
                                  <div style={{"marginRight":"6px"}} className='assign-icon'><EventAvailableSharpIcon style={{ "height": "18px" }}/></div>
                                  <Button onClick={() => handleCreateNewSubTask(item.id)} style={{"backgroundColor":"blue","color":"white","fontSize":"12px","fontWeight":"bold","height":"24px"}}>SAVE</Button>
                                  <div style={{"paddingTop":"4px","marginRight":"6px"}}><CloseIcon /></div>
                                </div>






                              </div>
                            ) : (<div></div>)}








                            {snapshot.isDragging === false ? (
                              <div style={{ "marginTop": "0px", "boxShadow": "0 0 3px rgba(0, 0, 0, 0.400)", "width": "100%", "height": "1px" }}></div>
                            ) : (<div></div>)}

                            {countEle(open, parseInt(item.id)) ? (
                              <div>
                                {snapshot.isDragging === false ? (
                                  <ServiceCommandUnit
                                    subItems={item.subItems}
                                    type={item.id}
                                  />
                                ) : (<div></div>)}
                              </div>
                            ) : (<div></div>)}


                          </div>
                          {provided.placeholder}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>




          </div>


        </DragDropContext >
      </div >



      <div className="create-new-task">


        <Button style={{ "fontSize": "10px", "display": `${create === false ? "block" : "none"}` }} onClick={handleNewTask}>
          + New Task
        </Button>

        <div style={{ "display": `${create === false ? "none" : "block"}` }}>
          <input type="text" onChange={(e) => {
            setTask(e.target.value);
          }} />
          <Button onClick={handleCreateNewTask}>Submit</Button>
        </div>



      </div>



    </div >
  );
}

export default App;
