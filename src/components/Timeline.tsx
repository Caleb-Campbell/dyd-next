import { CreatePost } from "./CreatePost"
import { useSession } from "next-auth/react"
import { api, RouterOutputs } from "~/utils/api"
import { useState, useEffect } from "react"
import Image from "next/image"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import updateLocal from "dayjs/plugin/updateLocale"
import { AiFillHeart } from "react-icons/ai";


dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "1m",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1M",
    MM: "%dM",
    y: "1y",
    yy: "%dy",
  },
});

function useScrollPosition(){
    const [scrollPosition, setScrollPostion] = useState(0)

    function handleScroll(){
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight

        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

        const scrolled = (winScroll / height) * 100;

        setScrollPostion(scrolled)
    }

    useEffect(()=> {
        window.addEventListener("scroll", handleScroll, {passive: true});

        return ()=>{
            window.removeEventListener("scroll", handleScroll)
        }
    },[])

    return scrollPosition


}


export function Timeline(){

    const scrollPosition = useScrollPosition()


    const {data, hasNextPage, fetchNextPage, isFetching} = api.post.timeline.useInfiniteQuery({
        limit: 10,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    const posts = data?.pages.flatMap((page)=>page.posts) ?? []

    useEffect(()=>{
        if(scrollPosition > 90 && hasNextPage && !isFetching){
            fetchNextPage()
        }
    },[scrollPosition, hasNextPage, isFetching, fetchNextPage])

    const { data: session } = useSession()
    return (
        <div data-theme='light' className=" mx-auto h-max">
            {
                session ? (<CreatePost />) : (<h2 className="text-light font-bold text-center text-xl underline">Log in to Create a Post</h2>) 
            }
            <div className="rounded-md">
            {posts.map((post)=> {
                return <Post  key={post.id} post={post} />
            })}

{
                !hasNextPage && <p>No more posts to see!</p>
            }
            
            </div>
        </div>
    )
}

function Post ({ post }:{post: RouterOutputs['post']['timeline']["posts"][number] }) {


    return (
        <div className="mb-4 bg-secondary rounded opacity-80">
            <div>
                    <h3 className=" font-bold text-xl text-center">{post.title}</h3>
                </div>
            <div className="flex p-2">

            {post.author.image && 
            <Image alt='profile-picture' src={post.author.image} width={48} height={48} className='rounded-full' />
            }
                
            <div className="ml-2">

            <div className="flex align-center">
                <p className="font-bold">{post.author.name}</p>
                <p className="text-sm text-gray-400"> - {dayjs(post.createdAt).fromNow()}</p>
            </div>
            <div>{post.text}</div>

            </div>

        </div>
        <div className="flex mt-4 p-2 items-center">
            <AiFillHeart 
            // color="red"
            size='1.5rem'
            
            />
            <span className="text-sm text-gray-500">{10}</span>
        </div>
        </div>
    )

}