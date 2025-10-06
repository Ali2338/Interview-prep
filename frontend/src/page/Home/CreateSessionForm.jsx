import React, { useState } from 'react'
import { Await, useNavigate } from 'react-router-dom'
import Input from '../../components/inputs/Input';
import SpinnerLoader from '../../components/loader/SpinnerLoader';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const CreateSessionForm = () => {
    const[formData,setFormData] = useState({
        role:"",
        experience:"",
        topicToFocus:"",
        description:"",
    });

    const[isLoading,setIsLoading] = useState(false);
    const[error,setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (key,value)=>{
        setFormData((prevData)=>({
            ...prevData,
            [key]:value,
        }));
    };

    const handleCreatSession = async(e)=>{
        e.preventDefault();
        const{role,experience,topicToFocus} = formData;
        if(!role||!experience||!topicToFocus){
            setError("Please fill all required feilds");
            return;
        }
      setError("");
      setIsLoading(true);
      try{
        const airesponse = await axiosInstance.post(
            API_PATHS.AI.GENRATE_QUESTIONS,
            {
                role,
                experience,
                topicToFocus,
                numberOfQuestions:10,
            }
        );

        const generatQuestion = airesponse.data;

        const response = await axiosInstance.post(API_PATHS.SESSION.CREATE,{
            ...formData,
            questions:generatQuestion,
        });

        if(response.data?.session?._id){
            navigate(`/interview-prep/${response.data?.session?._id}`)
        }
      }catch(error){
        if(error.response && error.response.data.message){
          setError(error.response.data.message);
        }else{
            setError("Something went wrong.Please try again later.")
        }
      }finally{
        setIsLoading(false);
      }
    };

  return <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
         <h3 className='text-lg font-semibold text-black'>Start a new interview journey</h3>
         <p className='text-xs text-slate-700 mt-[5px] mb-3'>
            Fill out a few quick details and unlock your personalized set of interview questions
         </p>
         <form onSubmit={handleCreatSession} className='flex flex-col gap-3'>
            <Input
             value = {formData.role}
             onChange={({target})=> handleChange("role",target.value)}
             label="Target Role"
             placeholder="(e.g., frontend developer, UI/UX designer etc)"
             type="text"
             />
             <Input
             value = {formData.experience}
             onChange={({target})=> handleChange("experience",target.value)}
             label="Years of experience"
             placeholder="(e.g., 1 yaer, 3 year, 5+ year etc)"
             type="number"
             />
             <Input
             value = {formData.topicToFocus}
             onChange={({target})=> handleChange("topicToFocus",target.value)}
             label="Topic to focus on"
             placeholder="(comma-seperated e.g., React, Node.js, Mongodb etc)"
             type="text"
             />
             <Input
             value = {formData.description}
             onChange={({target})=> handleChange("description",target.value)}
             label="Description"
             placeholder="(Any specific goal or notes for this session)"
             type="text"
             />
             {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
             <button
               className='btn-primary w-full mt-2'
               type='submit'
               disabled={isLoading}>
               {isLoading && <SpinnerLoader/>} Create Session
               </button>
         </form>
  </div>
}

export default CreateSessionForm
