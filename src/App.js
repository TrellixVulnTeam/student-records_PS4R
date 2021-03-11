
import React, { useEffect, useState } from 'react';
import './App.css'
// import data from './Student_Data.json' ;
import Card from './Component/Card/Card';
import { v4 as uuidv4 } from 'uuid';

import { useHistory } from "react-router-dom";
import { MDBCol, MDBFormInline, MDBBtn } from "mdbreact";
import { Button } from 'reactstrap';
import Modal from './Component/Modal/Modal'
import CardDetails from './Component/CardDetails/CardDetails'
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from'./Axios'
//   import history from './Component/History/history';
import RecordDetails from './Component/RecordDetails/RecordDetails';

import CustomizedTables from './Component/DataTable/Table'

function App() {
const [fav, setFav] =useState([])
const [data, setData]=useState([])
const [companyName,setcompanyName] =useState("")
const [searchText,setSearchText]=useState("")
const [searchInvoked,setSearchInvoked]=useState(false)
const [flag, setFlag] = useState(false)
const [nextCursor, setNextCursor] = useState(null)
console.log(nextCursor,'nextCursor');
const history= useHistory()

useEffect(()=>{
    setFlag(true);
   axios.get(`/v1/record/getpaginatedrecords?next_cursor=${nextCursor}`)
    .then(
        res=>{
            console.log(res)
            setData(res.data)
            setFlag(false);
        })
    .catch((e)=>{
        setFlag(false)
        console.log(e)
    })
},[])

// ********* CHANGE *************

     
        
            function handleClear(){
                setSearchText("")
                setSearchInvoked(false)
                axios.get(`/v1/record/getpaginatedrecords?next_cursor=${nextCursor}`) 
                .then(res=>{
                        console.log(res)
                        setData(res.data)
                        setFlag(false);
                    })
                .catch((e)=>{
                    setFlag(false)
                    console.log(e)
                })
                }

            function handleSearch () {
                    setSearchInvoked(true)
                    setFlag(true)
                    axios.get(`/v1/record/recordbyname?searchText=${searchText}`)
                    .then(res=>{
                          console.log(res)
                          setData(res.data)
                          setFlag(false);
                      })
                  .catch((e)=>{
                      setFlag(false)
                      console.log(e)
                  })
                
            }

            useEffect(()=>{
                if(data && data.length) {
                    const lastElemId = data[data.length-1]._id
                   setNextCursor(lastElemId)
                }
                },[data])

            function handleKeyPress (e) {
                if(e.which == 13 || e.keyCode == 13){
                //   console.log("enter press here!");
                  handleSearch()
                }
              }

              function getNext(){
                setFlag(true)
                    axios.get(`v1/record/getpaginatedrecords?next_cursor=${nextCursor}`)
                        .then(res=>{
                            console.log(res)
                            let copyData=[...data,...res.data]
                            setData(copyData)
                            setFlag(false)
                        })
                        .catch(e=>{
                            setFlag(false)
                            console.log(e)
                        })
            }
            function getprev(){
                setFlag(true)
                    axios.get(`v1/record/getpaginatedrecords?next_cursor=${nextCursor}`)
                        .then(res=>{
                            console.log(res)
                            let copyData=[...data,...res.data]
                            setData(copyData)
                            setFlag(false)
                        })
                        .catch(e=>{
                            setFlag(false)
                            console.log(e)
                        })
            }

            



if(flag){
    return <LinearProgress variant="determinate"/>
}

return (  
<div style={{backgroundColor: 'white' , margin:'20px', padding:'20px'}}>
<h1><em><u> Company Records: </u></em></h1>
    <div style={{margin:'30px'}}>
    <input value={searchText} onKeyPress={(e)=>handleKeyPress(e)} onChange={(e)=>setSearchText(e.target.value)}/>
    <span style={{marginLeft:'20px'}}><Button disabled={searchInvoked} onClick={()=>handleSearch()} color="primary">Search</Button></span>
        {
        searchInvoked && <span style={{marginLeft:'20px'}}>
            <Button onClick={()=>handleClear()} color="primary">Clear</Button>
        </span>
        }
    </div>
     
    <div>
    <div style={{margin:'20px',textAlign:'right'}}>
    <Button disabled={data.length===100?true:false} onClick={()=>getNext()} color="secondary">Next</Button>
    </div>
    {/* <div style={{margin:'20px',textAlign:'left'}}>
    <Button disabled={data.length===0?true:false} onClick={()=>getprev()} color="secondary">Previous</Button>
    </div> */}
    <CustomizedTables
    data={data}/>
    </div>  
</div>
);      
}

        export default App