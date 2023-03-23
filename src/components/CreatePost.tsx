import { useState } from "react"
import { api } from "~/utils/api"
import { z } from "zod"


export const postSchema = z.object({
    text: z.string({
        required_error: "Caption Required"
    }).min(1).max(280),
    title: z.string({
        required_error: "Title Required"
    }),
    img: z.string({
        required_error: "Please add an image to show what you Dyd!"
    })
})


export function CreatePost(){

    const [text, setText] = useState<string>("")
    const [title, setTitle] = useState<string>("")
    const [img, setImg] = useState<string>("")
    const [error, setError] = useState<string>("")

    const utils = api.useContext();

    const { mutateAsync } = api.post.create.useMutation({
        onSuccess: ()=> {
            setText("");
            utils.post.timeline.invalidate();
        }
    })


    const handleSubmit = async (e:any) => {
        e.preventDefault()
        try {
             postSchema.parse({text, title, img})
        } catch(err){setError(e.message) 
            return }
        if(!title){
            setError('Please include a title')
            return 
        }
        mutateAsync({title, text, img})
    }

    return (
        <>
        {error && JSON.stringify(error)}
        <form onSubmit={handleSubmit} data-theme='dark' className="w-full flex flex-col border-2 p-4 rounded-md mb-4 m-auto">
            <h2 className="text-light font-bold text-center text-text text-xl underline">Create a New Post</h2>
            <label className='text-text fs- text-center text-xl p-1 font-bold'> Title
            <input type='text' className="text-black shadow p-1 w-full text-lg rounded-lg" value={title} onChange={(e)=> {setTitle(e.currentTarget.value)}} />
            </label>
            <label className='text-text  text-center text-xl p-1 font-light'> Image Link
            <p className="text-sm">To use less data, please include a link from {" "}<a className="text-blue-800" target='blank' href="https://imgbb.com/">ImgBB</a> and paste the link below: </p>
            <input type='text' className="text-black shadow p-1 w-full text-lg rounded-lg" value={img} onChange={(e)=> {setImg(e.currentTarget.value)}} />
            </label>
            <label className="text-text fs- text-center text-xl p-1 font-bold"> Description
            <textarea className="text-black text-sm font-light shadow p-4 w-full rounded-lg" value={text} onChange={(e)=> {setText(e.currentTarget.value)}} />
            </label>
            <div className="mt-4 flex justify-end"><button className="px-3 mx-1 p-1 rounded border-primary-400 text-text border-2 hover:text-primary hover:bg-white" type="submit">Share</button></div>
        </form>
        </>
    )

}