import React, { Component } from 'react'; 
import { dijkstra, getNodesInShortestPathOrderOfDijkstra } from '../algorithms/dijkstra';
import {BFS,getNodesInShortestPathOrderOfBFS} from '../algorithms/bfs';
import {AStar,getNodesInShortestPathOrderOfAStar} from '../algorithms/Astar'; 
import {Greedy_BFS,getNodesInShortestPathOrderOfGreedyBfs} from '../algorithms/greedy_bfs'; 

import Navbar from './navbar';
import Node from '../node/node'; 
import instructions from './instructions';
//import {aStar,getNodesInShortestPathOrderOfaStar} from '../algorithms/astar'

import "./visualizer.css";


let START_NODE_ROW = 2;
let START_NODE_COL = 2;
let FINISH_NODE_ROW = 8;
let FINISH_NODE_COL = 8; 
let  isWPressed = false;



export default class Visualizer extends Component {
    state = {  
        grid: [], 
        startchange: false,
        endchange: false,   
        currentAlgorithm: null,
      mouseIsPressed: false,
     }  


     componentDidMount() {
        const grid = getInitialGrid();
        this.setState({grid});
        // console.log( grid);
      }  

      
      
  handleMouseDown=(row, col)=> {  
     const { grid} = this.state;
     if( isWPressed) 
     {    this.setState({mouseIsPressed: true});  
     setTimeout(() => {
      // console.log( document.getElementById(`node-${row}-${col}`)); 
      const newGrid = grid.slice();  
      const Node = newGrid[row][col];
     let newNode= {};
     newNode = {
      ...Node,
      weight:2.0
     }; 
     newGrid[row][col]=newNode;
     this.setState({ grid:newGrid}); 
  
      document.getElementById(`node-${row}-${col}`).className =`node  node-weighted`;
    }, 10);
    }
     

    if( row === START_NODE_ROW && col === START_NODE_COL) 
     {    this.setState({startchange:true,mouseIsPressed: true});   
     return;  }
    if( row === FINISH_NODE_ROW && col === FINISH_NODE_COL)  
    {  
      this.setState({endchange:true,mouseIsPressed: true});   
     return;  }
    if(!isWPressed) { const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true}); }
  } 


  handleMouseEnter=(row, col) =>{ 
    if (!this.state.mouseIsPressed) return; 

      const { grid} = this.state;
    if( isWPressed) 
    {    this.setState({mouseIsPressed: true});  
    setTimeout(() => {
     // console.log( 'aaa'); 
     const newGrid = grid.slice();  
     const Node = newGrid[row][col];
    let newNode= {};
    newNode = {
     ...Node,
     weight:2.0
    }; 
    newGrid[row][col]=newNode;
    this.setState({ grid:newGrid}); 
    console.log( grid[row][col] );
     document.getElementById(`node-${row}-${col}`).className =`node  node-weighted`;
   }, 10);
  }
    const{ startchange, endchange}= this.state;  
    if(startchange) 
    { 
      const newGrid =changeStartPoint(this.state.grid, row, col, 1);
      this.setState({grid: newGrid});
      START_NODE_ROW = row;
      START_NODE_COL = col;  
      const newstGrid =changeStartPoint(this.state.grid, row, col, 0, 1);
      this.setState({grid: newstGrid});
      
    }  
    else if(endchange) 
    { 
      const newGrid =changeEndPoint(this.state.grid, row, col, 1);
      this.setState({grid: newGrid});
     FINISH_NODE_ROW = row;
      FINISH_NODE_COL = col;  
      const newstGrid =changeEndPoint(this.state.grid, row, col,  0, 1);
      this.setState({grid: newstGrid});
      
    } 
   else if( !isWPressed) { const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid}); }
  }

  handleMouseUp=(row,col)=> { 
    const{ startchange, endchange}= this.state; 
    if( startchange) { this.setState({startchange:false,mouseIsPressed: false}); }
  else  if( endchange) this.setState({endchange:false,mouseIsPressed: false}); 
    else  this.setState({mouseIsPressed: false}); 
  
  }    
 
  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i]; 
        if(!node.isWall)
        document.getElementById(`node-${node.row}-${node.col}`).className =
          `node  ${ node.row===START_NODE_ROW && node.col===START_NODE_COL ?'node-start': 
          node.row===FINISH_NODE_ROW && node.col===FINISH_NODE_COL? 'node-finish':node.iswall?'node-wall':'node-visited'}`;
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    // console.log(this.state.grid);
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          `node  ${ node.row===START_NODE_ROW && node.col===START_NODE_COL ?'node-start': 
           node.row===FINISH_NODE_ROW && node.col===FINISH_NODE_COL? 'node-finish':'node-shortest-path'}`;
      }, 50 * i);
    }
  }
 
  visualizeAlgorithm =( name)=> {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];  
    let visitedNodesInOrder; let nodesInShortestPathOrder;
    // console.log( name);
    if( name ==='dijkstra'){
     visitedNodesInOrder = dijkstra(grid, startNode, finishNode); 
     nodesInShortestPathOrder = getNodesInShortestPathOrderOfDijkstra( finishNode); 
    }  
    else if( name ==='BFS') 
    {
      visitedNodesInOrder = BFS(grid, startNode, finishNode);  
      nodesInShortestPathOrder = getNodesInShortestPathOrderOfBFS(finishNode);  
    } 
    else if( name ==='A*') 
    {
      visitedNodesInOrder = AStar(grid, startNode, finishNode);  
      nodesInShortestPathOrder = getNodesInShortestPathOrderOfAStar(finishNode);  
    }  
    else if( name ==='Greedy-best-first') 
    {
      visitedNodesInOrder = Greedy_BFS(grid, startNode, finishNode);  
      nodesInShortestPathOrder = getNodesInShortestPathOrderOfGreedyBfs(finishNode);  
    } 
    else return;
    // console.log( nodesInShortestPathOrder);   
    // console.log( visitedNodesInOrder);   
     if( nodesInShortestPathOrder.length===1)  
     document.getElementById('input-message').innerHTML= `Path not  Found `;
     else
    document.getElementById('input-message').innerHTML= `Path Found , Shortest Path length - ${nodesInShortestPathOrder.length-1 }`;
      
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  } 
  
  
  
  
  resetGrid =( )=> {
    //  const { grid} = this.state; 
     const grid = [];
     for (let row = 0; row < 20; row++) {
       const currentRow = [];
       for (let col = 0; col < 20; col++) {
          currentRow.push(createNode(col, row)); 
          //`node-${row}-${col}`
      document.getElementById(`node-${row}-${col}`).className =
        `node  ${ row===START_NODE_ROW && col===START_NODE_COL ?'node-start': 
         row===FINISH_NODE_ROW && col===FINISH_NODE_COL? 'node-finish':''}`;
       
       }
       grid.push(currentRow);
     } 
     document.getElementById('input-message').innerHTML= `successfully Grid cleared`;
      
       this.setState({ grid});
    // console.log(grid); 
  } 

   clearPath=()=> {
     const { grid}= this.state;  
     const gridNew = []; 
     for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 20; col++) {
         currentRow.push(createNode(col, row,grid[row][col].isWall));  
        if(grid[row][col].isWall) { 
          document.getElementById(`node-${row}-${col}`).className='node node-wall'; }
      else { document.getElementById(`node-${row}-${col}`).className =
       `node  ${ row===START_NODE_ROW && col===START_NODE_COL ?'node-start': 
        row===FINISH_NODE_ROW && col===FINISH_NODE_COL? 'node-finish':''}`; }
      
      }
      gridNew.push(currentRow);
    }  //document.getElementById('input-message').className= `highlight`;
    document.getElementById('input-message').innerHTML= `successfully path cleared`;
      this.setState({ grid: gridNew});
    //  console.log( grid);
   }

   

  

    render() {    
     
      window.addEventListener("keydown", (e) => {
        if( e.key ==="w")  isWPressed= true; 
        
      }); 
      window.addEventListener("keyup", (e) => {
        if( e.key ==="w")  isWPressed= false; 
        
      });
        const {grid,mouseIsPressed}= this.state;
        
        return (  
        //  
          <div> 
             
             < Navbar 
              clearPath= {this.clearPath} 
              resetGrid = { this.resetGrid} 
              visualizeAlgorithm = { this.visualizeAlgorithm}
               />
               <instructions/>  
            < div className = 'message-show my-3' id='input-message'> 
              Please First Select Algorithm
            </div>
          
            <div className="grid">
            {grid.map((row, rowIdx) => {
              return ( 

                <div key={rowIdx} className="gridRow">
                  {row.map((node, nodeIdx) => {
                     const {row, col, isFinish, isStart, isWall, isVisited,parent,isWeighted,f,g,h} = node; 
                    // console.log( 'a');
                     return (
                       <Node
                       key={nodeIdx} 
                       row={row}
                       col={col}
                       isFinish={isFinish}
                       isStart={isStart}
                       isWall={isWall} 
                       isVisited={isVisited}
                       isWeighted= { isWeighted}
                       parent={parent}
                       mouseIsPressed={mouseIsPressed}
                       f={f}
                       g={g}
                       h={h}
                       onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                       onMouseEnter={(row, col) => {return  this.handleMouseEnter(row, col)}}
                       onMouseUp={(row, col) => { return this.handleMouseUp(row,col)}}

                      //  onKeyDown={ ()=> { return this.handleKeyPress } }
                       ></Node>
                    );
                  })}
                </div>
              );
            })}
          </div>
          </div>
         );
    }
}
 // row= 60, col= 20  

 
const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 20; col++) {
        currentRow.push(createNode(col,row));
      }
      grid.push(currentRow);
    }
    return grid;
  }; 

  
const createNode = ( col,row,wall=false) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: wall, 
    weight:1.0, 
    f: Infinity,
    g: Infinity,
    h: Infinity,
    parent :null,
    previousNode: null,
    
  };
}; 

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];  
   let newNode= {};
   newNode = {
    ...node,
    isWall: !node.isWall, 
  }; 
 newGrid[row][col] = newNode; 
  return newGrid;
}; 


const changeStartPoint = (grid, row, col, previousStart=0, newStart=0) => {
  const newGrid = grid.slice();  
  const startNode = newGrid[START_NODE_ROW][START_NODE_COL];  
   let newNode= {};
   let previousNode= {};
  if(previousStart)  
  {
    previousNode = {
      ...startNode,
      isStart: false
    }; 
    newGrid[START_NODE_ROW][START_NODE_COL]=previousNode;
   }  
   
   if(newStart)  
   {
     newNode = {
       ...startNode,
       isStart: true
     }; 
     newGrid[START_NODE_ROW][START_NODE_COL]=newNode;
    }  

  return newGrid;
}; 


const changeEndPoint = (grid, row, col,  previousEnd=0,newEnd=0) => {
  const newGrid = grid.slice();  
  const endNode = newGrid[FINISH_NODE_ROW][FINISH_NODE_COL];
   let newNode= {};
   let previousNode= {};
  
   if(previousEnd)  
  {
    previousNode = {
      ...endNode,
      isFinish: false
    }; 
    newGrid[FINISH_NODE_ROW][FINISH_NODE_COL]=previousNode;
   } 
   
    if(newEnd)  
  {
    newNode = {
      ...endNode,
      isFinish: true
    }; 
    newGrid[FINISH_NODE_ROW][FINISH_NODE_COL]=newNode;
   } 
  return newGrid;
};
