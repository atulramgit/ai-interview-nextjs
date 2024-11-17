"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModal";
import { LoaderCircle } from "lucide-react";
import { MockInterview } from "@/utils/schema";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {

    const [openDialog, setOpenDialog] = useState(false)
    const [jobPosition, setJobPosition] = useState()
    const [jobDesc, setJobDesc] = useState()
    const [jobExperience, setJobExperience] = useState()
    const [loading, setLoading] = useState(false)
    const [jsonResponse, setJsonResponse] = useState([])
    const {user} = useUser()
    const router = useRouter();

    const onSubmit = async (e) => {
      setLoading(true)
      e.preventDefault()
      console.log(jobPosition, jobDesc, jobExperience)

      const InputPrompt="Job position: "+jobPosition+"; Job Description: "+jobDesc+"; Years of Experience: "+jobExperience+", depending on the job position, job description and years of experience give us "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" interview questions along with answers in JSON format. Give us question and answer field on JSON"

      const result = await chatSession.sendMessage(InputPrompt)

      const MockJsonResp = (result.response.text()).replace('```json','').replace('```', '');
      // console.log(JSON.parse(MockJsonResp));

      setJsonResponse(MockJsonResp);

      if(MockJsonResp) 
      {
      const resp = await db.insert(MockInterview)
      .values({
        mockID:uuidv4(),
        jsonMockResp:MockJsonResp,
        jobPosition:jobPosition,
        jobDesc:jobDesc,
        jobExperience:jobExperience,
        createdBy:user?.primaryEmailAddress?.emailAddress,
        createdAt:moment().format('DD-MM-YYYY')
      }).returning({mockID:MockInterview.mockID})

      console.log("Inserted ID:", resp)
      if(resp)
      {
        setOpenDialog(false);
        router.push('/dashboard/interview/'+resp[0]?.mockID)
      }
    }
    else{
      console.log("Error inserting mock interview")
    }
      setLoading(false)
    }

  return (
    <div>
      <div className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
      onClick = {() => setOpenDialog(true)} >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
  <DialogContent className='max-w-2xl'>
    <DialogHeader>
      <DialogTitle className='text-2xl'>Tell us more about your job interview</DialogTitle>
      <DialogDescription>
        <form onSubmit={onSubmit}>
        <div>
            <h2>Add Details about your job position/role, Job description and years of experience</h2>

            <div className="mt-7 my-3">
                <label>Job Role/Job Position</label>
                <Input placeholder="eg. Full Stack Developer" required
                onChange = {(e) => setJobPosition(e.target.value)}/>
            </div>
            <div className="my-3">
                <label>Job Description/Tech Stack</label>
                <Textarea placeholder="eg. React, Angular, NodeJs, MySQL etc." required
                onChange = {(e) => setJobDesc(e.target.value)}/>
            </div>
            <div className="my-3">
                <label>Years of Experience</label>
                <Input placeholder="eg. 5" type="number" max="50" required
                onChange = {(e) => setJobExperience(e.target.value)}/>
            </div>
        </div>
        <div className="flex gap-5 justify-end">
            <Button type="button" variant="ghost" onClick = {() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ?
              <>
              <LoaderCircle className="animate-spin"/>Generating with AI 
              </>: 'Start Interview'
            }</Button>
        </div>
        </form>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

    </div>
  );
}

export default AddNewInterview;
