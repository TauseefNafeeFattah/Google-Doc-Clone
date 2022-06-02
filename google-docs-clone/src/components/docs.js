import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';
import { doc, addDoc, deleteDoc, onSnapshot, collection } from 'firebase/firestore';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Docs({database}){
  let navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = useState('');
  const [docsData, setDocsData] = useState([]);

  const collectionRef = collection(database,'docsData');
  const isMounted = useRef();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // adds the doc to the database
  const addData = () =>{
    addDoc(collectionRef,{
      title:title,
      docsDesc:''
    }).then(() =>{
        toast.success('Data Added', {autoClose: 2000})
        handleClose();
    }).catch(() => {
        toast.error('Cannot Add Data', {autoClose: 2000})
    })
  }
  // gets the documents from the database
  const getData = () =>{
    onSnapshot(collectionRef, (data) =>{
      setDocsData(data.docs.map((doc)=>{
        return{...doc.data(),id:doc.id}
      }))
    })
  }

  // navigate to a specific document
  const getID = (id) => {
      navigate(`/editDocs/${id}`);
  }
  
  useEffect(() =>{
    if(isMounted.current){
      return;
    }
    isMounted.current = true;
    getData()
  },[])

  return (
    <div className='docs-main'>
      <h1>Docs Clone</h1>
      <button className='add-docs' onClick={handleOpen}> Add a Document </button>
      <div className='grid-main'>
          {docsData.map((doc)=>{
              return(
                <div className='grid-child' >
                  <div  onClick={()=>getID(doc.id)}>
                    <p>{doc.title}</p>
                    <div dangerouslySetInnerHTML={{ __html: doc.docsDesc.substring(0,50) }} />
                  </div>
                </div>
              )
          })}
      </div>
      <Modal open={open} setOpen= {setOpen} title={title} setTitle={setTitle} addData={addData} />
    </div>
  )
}
