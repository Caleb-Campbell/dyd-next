import React from "react"

export function Container ({children, classNames = ""}: {children: React.ReactNode, classNames?: string}){
    return (
        <div className={`max-w-xl m-auto bg-primary ${classNames}`}>
            {children}
        </div>
    )
}