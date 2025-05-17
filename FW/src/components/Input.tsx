interface InputProps{
    placeholder:string;
    reference?:any
    type:string
}

export function Input({placeholder,reference,type}:InputProps){
    return <div>
        <input ref={reference} placeholder={placeholder} type={type} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></input>
    </div>
}