"use client";

const Input = ({className = "", ...props}: any) => {
    return <input className={`p-1.5 text-xs placeholder:text-3xl text-inactive bg-tertiary rounded-xl font-normal ${className}`} {...props} />
}

export default Input;