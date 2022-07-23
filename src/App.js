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
import DriveFileRenameOutlineSharpIcon from '@mui/icons-material/DriveFileRenameOutlineSharp';
import EditIcon from '@mui/icons-material/Edit';
// import { borderBottom } from '@mui/system';





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



function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(static_items)
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





  return (
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
                              <div className="arrow-right-dir"><ArrowRightIcon /></div>
                              <div className="tick"><DoneIcon style={{ "color": "black", "fontWeight": "bold", "height": "17px" }} /></div>

                              <div style={{ "marginLeft": "10px", "color": "black" }} >{item.content}</div>

                              <div className="subtask-icon" style={{ "border": "1px solid black", "marginLeft": "10px", "height": "16px", "borderRadius": "4px", "display": "flex", "alignItems": "center", "justifyContent": "center" }}><AssignmentIcon style={{ "height": "14px" }} /></div>
                              <div className="rename-icon" style={{ "border": "1px solid black", "marginLeft": "6px", "height": "16px", "borderRadius": "4px", "display": "flex", "alignItems": "center", "justifyContent": "center" }}><DriveFileRenameOutlineSharpIcon style={{ "height": "14px" }} /></div>
                              <div className="edit-task-icon" style={{ "border": "1px solid black", "marginLeft": "6px", "height": "16px", "borderRadius": "4px", "display": "flex", "alignItems": "center", "justifyContent": "center" }}><EditIcon style={{ "height": "14px" }} /></div>
                            </div>

                            <div className='inside-card2'>
                              <div className="assign-icon"><AssignmentIndSharpIcon style={{ "height": "20px" }} /></div>
                              <div className="due-data"><EventAvailableSharpIcon style={{ "height": "20px" }} /></div>
                              <div className="three-dots"><MoreHorizSharpIcon style={{ "height": "20px" }} /></div>
                            </div>
                          </div>

                          {snapshot.isDragging === false ? (
                            <div style={{ "marginTop": "0px", "boxShadow": "0 0 3px rgba(0, 0, 0, 0.400)", "width": "100%", "height": "1px" }}></div>
                          ) : (<div></div>)}

                          {snapshot.isDragging === false ? (
                            <ServiceCommandUnit
                              subItems={item.subItems}
                              type={item.id}
                            />
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


      </DragDropContext>
    </div>
  );
}

export default App;
