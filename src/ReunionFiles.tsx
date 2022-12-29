import React from "react";
import FileLinks from "./FileLinks";

interface Props {
    data: {
        description: string
        name: string
        num_pages: number
        page:number
    }[]
    loading: boolean
}

const ReunionFiles:React.FC<Props> = ({data,loading}) => {
    if(loading) return<h1>Loading...</h1>
    if(data.length==0) return <h1>Nothing found</h1>

    const file = data[0]
    const {description,name,num_pages,page} = data[10]

    return (
        <>
            <div className='flex justify-between'>
                <h1 className='text-xl'>{name}</h1>
                <span>Page {page} of {num_pages}</span>
            </div>
            <FileLinks file={file}/>
            <div className='border-solid border-2 border-grey-700'>
                {description}
            </div>
        </>
    )
}
export default ReunionFiles