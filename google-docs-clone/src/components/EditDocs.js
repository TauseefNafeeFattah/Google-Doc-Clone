import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { deleteDoc, updateDoc, collection, doc, onSnapshot} from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditDocs({database}){
    let params = useParams();
    let navigate = useNavigate();
    const isMounted = useRef();
    const collectionRef = collection(database, 'docsData')

    const [documentTitle, setDocumentTitle] = useState('')
    const [docsDesc, setDocsDesc] = useState('');

    const goHome = () => {
        navigate(`/`);
    }
    const getQuillData = (value) =>{
      setDocsDesc(value)
    }

    useEffect(()=>{
      const updateDocsData = setTimeout(() =>{
        const document = doc(collectionRef, params.id);
        updateDoc(document, {
          docsDesc: docsDesc
        }).then(()=>{
            toast.success('Document Saved', {autoClose: 2000})
        }).catch(()=>{
            toast.error('Cannot Save Document', {autoClose: 2000})
        })
      }, 1000)
      return () => clearTimeout(updateDocsData)
    }, [docsDesc])

    const getData = () => {
        const document = doc(collectionRef, params.id)
        onSnapshot(document, (docs) => {
            setDocumentTitle(docs.data().title);
            setDocsDesc(docs.data().docsDesc);
        })
    }
    const deleteData = () =>{

      deleteDoc(doc(database, "docsData", params.id)).then(
        () =>{
            toast.success('Data Deleted', {autoClose: 2000});
            goHome();
        }
      ).catch(
        () => {
            toast.error('Cannot delete Data', {autoClose: 2000})
        }
      );
    }
    useEffect(() => {
      if (isMounted.current){
        return
      }
      isMounted.current = true;
      getData()
    },[])

    return (
      <div className="editDocs-main">

          <h1>{documentTitle}</h1>
          <div className="editDocs-inner">
            <ReactQuill
                value={docsDesc}
                onChange={getQuillData}
            />
          </div>
          <div className="buttons">
            <button className='go-home-button' onClick={goHome}> Go back to homepage </button>
            <button className='delete-docs' onClick={deleteData}> Delete </button>
          </div>
      </div>
    )
}
