"use client";
import useSpeechToText from 'react-hook-speech-to-text';
import { Button } from '@/components/ui/button';
import Webcam from 'react-webcam';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Mic, StopCircle } from 'lucide-react';
import { toast } from 'sonner';

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex }) {
  const [userAnswer, setUserAnswer] = useState('');
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    if (results.length > 0) {
      setUserAnswer(results.map((result) => result?.transcript).join(' '));
    }
  }, [results]);

  useEffect(() => {
    if (error) {
      toast.error(`Speech recognition error: ${error}`);
    }
  }, [error]);

  const SaveUserAnswer = () => {
    if (isRecording) {
      stopSpeechToText();
      if (userAnswer.length < 10) {
        toast.error('Your answer is too short. Please try recording again.');
        return;
      }

      const feedbackPrompt = `Question: ${mockInterviewQuestion} \nAnswer: ${userAnswer}`;
      console.log(feedbackPrompt); // Replace this with your save logic
    } else {
      setUserAnswer(''); // Clear previous answer before starting a new recording
      startSpeechToText();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col mt-20 justify-center items-center bg-secondary rounded-lg p-5">
        <Image
          src={'/webcam.png'}
          width={200}
          height={200}
          alt="Webcam Placeholder"
          className="absolute"
        />
        <Webcam
          mirrored={true}
          className="h-72 w-full z-10"
        />
      </div>
      <Button
        variant="outline"
        className="my-10"
        onClick={SaveUserAnswer}
        aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
      >
        {isRecording ? (
          <h2 className="text-red-600 animate-pulse flex gap-2 items-center">
            <StopCircle /> Stop Recording
          </h2>
        ) : (
          <h2 className="text-primary flex gap-2 items-center">
            <Mic /> Record Answer
          </h2>
        )}
      </Button>
    </div>
  );
}

export default RecordAnswerSection;
