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
    const [fileFilter,setFileFilter]=useState('')

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
        setFileFilter(e.target.value)
        setPageNumber(0)
    }

    const files = filter(data, method('name.match', new RegExp(fileFilter, 'i')))
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
