import './App.css'
import Papa from 'papaparse';
import React, {StrictMode, useEffect, useState} from "react";
import filter from "lodash/filter";
import method from "lodash/method";
import ReunionFile from "./ReunionFile";
import csv from './data/thefiles.csv?url'

const App = () => {
    const [loading,setLoading]=useState(true)
    const [data,setData]=useState([] as any)
    const [pageNumber,setPageNumber]=useState(0)
    const [fileFilter, setFileFilter]=useState('')

    useEffect(() => {
        setLoading(true)

        Papa.parse(csv, {
            header: true,
            download: true,
            dynamicTyping: true,
            complete: ({data}) => {
                setLoading(false)
                // @ts-ignore
                setData(data)
            }
        })

        setLoading(false)
    },[])

    const search = (e:any) => {
        setFileFilter(e.target.value.toLowerCase())
        setPageNumber(0)
    }

    const isSubsequence = (str1:string|undefined, str2:string) => {
        if(!str1)return true
        if(!str2)return false

        let i=0;
        let j=0;
        while(i<str1.length){
            if(j===str2.length){
                return false;
            }
            if(str1[i].toLowerCase()===str2[j].toLowerCase()){
                i++;
            }
            j++;
        };
        return true;
    };

    const files = filter(data, (file)=>isSubsequence(fileFilter,file.name))

    const file = files[pageNumber] || files[0]

    return (
        <StrictMode>
            <input className='border-2 border-solid border-black' type='text' value={fileFilter} onChange={search}/>
            <ReunionFile
                file={file}
                loading={loading}
                pageNumber={pageNumber}
                setFileFilter={setFileFilter}
                setPageNumber={setPageNumber}
            />
        </StrictMode>
   )
}

export default App
