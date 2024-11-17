"use client";
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';

function StartInterview({params}) {

    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    useEffect(() => {
        GetInterviewDetails();
    },[]);

    /**
     * used to get interview details by MockId/Interview Id
     */

    const GetInterviewDetails = async () => {
        const result = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockID, params.interviewId));
        
        console.log(result); // Log the entire result
    
        if (result.length > 0) {
            const jsonMockResp = result[0].jsonMockResp;
            console.log('Raw jsonMockResp:', jsonMockResp); // Log the raw response
    
            try {
                const parsedResp = JSON.parse(jsonMockResp);
                console.log('Parsed jsonMockResp:', parsedResp); // Log the parsed response
                setMockInterviewQuestion(parsedResp);
            } catch (error) {
                console.error('Error parsing JSON:', error); // Log any parsing error
            }
            
            setInterviewData(result[0]);
        } else {
            console.log('No interview data found for the given ID.');
        }
    };

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                {/* Question */}
                <QuestionsSection 
                mockInterviewQuestion={mockInterviewQuestion}
                activeQuestionIndex={activeQuestionIndex}
                />

                {/* Video/Audio Recording */}
                <RecordAnswerSection mockInterviewQuestion={mockInterviewQuestion} activeQuestionIndex={activeQuestionIndex}/>
            </div>
        </div>
    )
}

export default StartInterview