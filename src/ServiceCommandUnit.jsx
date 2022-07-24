import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import AssignmentIndSharpIcon from '@mui/icons-material/AssignmentIndSharp';
import EventAvailableSharpIcon from '@mui/icons-material/EventAvailableSharp';
import MoreHorizSharpIcon from '@mui/icons-material/MoreHorizSharp';
import DriveFileRenameOutlineSharpIcon from '@mui/icons-material/DriveFileRenameOutlineSharp';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
// import ArrowRightIcon from '@mui/icons-material/ArrowRight';

// const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    // padding: grid * 2,
    // margin: `0 10px 10px 0`,

    // display: "inline-flex",
    width: "100%",
    // padding: "10px",

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",
    // display: "inline-flex",
    // padding: "10px",
    // margin: "0 10px 10px 0",
    // border: "1px solid grey",
    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    borderTop: isDraggingOver ? "1px solid blue" : "none",
    // padding: grid,
    // margin: "10px 0"
});

export default class ServiceCommandUnit extends React.Component {
    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        return (
            <Droppable droppableId={this.props.type} type={`droppableSubItem`}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                    >
                        {this.props.subItems.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided, snapshot) => (
                                    <div style={{ display: "flex" }}>
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}
                                            {...provided.dragHandleProps}
                                        >


                                            <div className="inside-inside-dragable" style={{ "paddingLeft": "20px" }}>

                                                <div className='inside-card1'>
                                                    <div>
                                                        <div className='L-shaped1'></div>
                                                        <div className='L-shaped2'></div>
                                                    </div>
                                                    <div className="tick"><DoneIcon style={{ "color": "black", "fontWeight": "bold", "height": "17px" }} /></div>

                                                    <div>
                                                        <div style={{ "fontSize": "12px", "paddingLeft": "10px" }}>Parent</div>
                                                        <div style={{ "marginLeft": "10px", "color": "black" }} >{item.content}</div>
                                                    </div>


                                                    {/* <div className="subtask-icon" style={{ "border": "1px solid black", "marginLeft": "10px", "height": "16px", "borderRadius": "4px", "display": "flex", "alignItems": "center", "justifyContent": "center" }}><AssignmentIcon style={{ "height": "14px" }} /></div> */}
                                                    <div className="rename-icon" style={{ "alignSelf": "flex-end", "border": "1px solid black", "marginLeft": "6px", "height": "16px", "borderRadius": "4px", "display": "flex", "alignItems": "center", "justifyContent": "center" }}><DriveFileRenameOutlineSharpIcon style={{ "height": "14px" }} /></div>
                                                    <div className="edit-task-icon" style={{ "border": "1px solid black", "alignSelf": "flex-end", "marginLeft": "6px", "height": "16px", "borderRadius": "4px", "display": "flex", "alignItems": "center", "justifyContent": "center" }}><EditIcon style={{ "height": "14px" }} /></div>
                                                </div>

                                                <div className='inside-card2'>
                                                    <div className="assign-icon"><AssignmentIndSharpIcon style={{ "height": "20px" }} /></div>
                                                    <div className="due-data"><EventAvailableSharpIcon style={{ "height": "20px" }} /></div>
                                                    <div className="three-dots"><MoreHorizSharpIcon style={{ "height": "20px" }} /></div>
                                                </div>
                                            </div>



                                        </div>
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {/* {provided.placeholder} */}
                    </div>
                )}
            </Droppable>
        );
    }
}
