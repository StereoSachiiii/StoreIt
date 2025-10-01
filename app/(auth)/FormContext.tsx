
import { useContext, useState } from 'react';
import type { formType } from '../../components/AuthForm';
import { createContext } from 'react';



const formContext = createContext(undefined)


export const FormProvider=({children}: {children:React.ReactNode})=>{
//initially sign up
    const [formType,setFormType] = useState("sign-up");

    return(
        <formContext.Provider value={{formType,setFormType}}>
            {children}
        </formContext.Provider>


    )

}


export const useFormContext=()=>{
    return useContext(formContext)

}