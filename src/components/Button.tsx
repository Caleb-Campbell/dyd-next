import React from "react"

export const Button = ({variant, children, onClick }: {variant: string, children: React.ReactNode, onClick: ()=>void}) => {


    if(variant ==='primary'){
        return (
            <button onClick={onClick} className="px-3 mx-1 p-1 rounded border-primary-400 text-text border-2 hover:text-primary hover:bg-text transition-all">
                {children}
            </button>
        )
    }

    else {
        return <></>
    }
}