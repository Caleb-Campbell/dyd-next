import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from './Button';

export function LoggedOutBanner () {
    const { data: session } = useSession()

    if(session){
        return null;
    }

    return (
        <div className='fixed bottom-0 w-1/2 p-4 text-text flex justify-around m-auto items-center'>
            <p>Don't miss out!</p>
            <div><Button variant='primary' onClick={signIn}>Login</Button></div>
        </div>
    )
}