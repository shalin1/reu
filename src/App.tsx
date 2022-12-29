import './App.css'
import Papa from 'papaparse';
import React, {useEffect, useState} from "react";
import ReunionFile from "./ReunionFile";
import filter from "lodash/filter";
import method from "lodash/method";

const App = () => {
    const [loading,setLoading]=useState(true)
    const [data,setData]=useState([] as any)
    const [pageNumber,setPageNumber]=useState(0)
    const [fileFilter,setFileFilter]=useState('')

    useEffect(() => {
        setLoading(true)

        Papa.parse('./thefiles.csv', {
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
        <>
            <input className='border-2 border-solid border-black' type='text' value={fileFilter} onChange={search}/>
            {file ? (
                <ReunionFile
                    file={file}
                    loading={loading}
                    pageNumber={pageNumber}
                    setFileFilter={setFileFilter}
                    setPageNumber={setPageNumber}
                />
            ) : (
                <h1>Try again...</h1>
            )}
        </>
   )
}

export default App
