'use client';

import React, { useEffect, useRef, useState } from 'react';
import { keyframes } from '@emotion/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

import { chatBotApi } from '@/hooks/server-actions/faq';

const bounce = keyframes`
0%, 80%, 100% {
  transform: scale(0);
  opacity: 0.6;
}
40% {
  transform: scale(1);
  opacity: 1;
}
`;

const faqs = [
  {
    question: 'How do I create an account?',
    answer:
      'To create an account, click the Sign Up button on the homepage and follow the instructions to register with your email and mobile number.',
  },
  {
    question: 'What is Engage used for?',
    answer:
      'Engage is a platform designed to help users connect, interact, and manage tasks in a collaborative environment.',
  },
  {
    question: 'How do I reset my password?',
    answer:
      'Click on Forgot Password on the login screen and follow the email verification steps to reset your password.',
  },
];

const FAQScreen = () => {
  const [userInput, setUserInput] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'bot'; message: string }[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const sendToAPI = async (message: string) => {
    setChatHistory((prev) => [...prev, { sender: 'user', message }]);
    setIsBotTyping(true);
    try {
      const res = await chatBotApi({
        question: message || '',
      });
      setChatHistory((prev) => [...prev, { sender: 'bot', message: res.data.answer }]);
      setIsBotTyping(false);
    } catch (error) {
      setChatHistory((prev) => [...prev, { sender: 'bot', message: error.error }]);
      setIsBotTyping(false);
    }
  };

  const handleSend = () => {
    if (!userInput.trim()) return;
    sendToAPI(userInput);
    setUserInput('');
  };

  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    synth.speak(utter);
  };

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let liveTranscript = '';

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      liveTranscript = transcript;
      setUserInput(transcript);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (liveTranscript.trim()) {
        sendToAPI(liveTranscript);
        setUserInput('');
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isBotTyping]);

  return (
    <Box>
      <Typography variant="h5" fontWeight={'bold'} mb={2}>
        FAQ and Virtual Assistant
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 1, boxShadow: 3 }}>
            <CardContent sx={{ paddingTop : 2}}>
              <Box display="flex" alignItems="center" >
                <Avatar sx={{ bgcolor: 'transparent', mr: 1 }}>🤖</Avatar>
                <Typography variant="h6" fontWeight="bold">
                  Ask a Question
                </Typography>
              </Box>
              <Paper
                sx={{
                  height: '50vh',
                  overflowY: 'auto',
                  p: 2,
                  mb: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                }}
              >
                {chatHistory.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Start asking questions and the bot will help you!
                  </Typography>
                )}
                {chatHistory.map((msg, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        px: 2,
                        py: 1,
                        bgcolor: msg.sender === 'user' ? '#6366f1' : '#e5e7eb',
                        color: msg.sender === 'user' ? '#fff' : '#111827',
                        borderRadius: 2,
                        maxWidth: '75%',
                      }}
                    >
                      <Typography variant="body2">{msg.message}</Typography>
                    </Box>
                  </Box>
                ))}
                {isBotTyping && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Analyzing
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '4px' }}>
                      {[0, 1, 2].map((i) => (
                        <Box
                          key={i}
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: '#999',
                            animation: `${bounce} 1.4s infinite ease-in-out`,
                            animationDelay: `${i * 0.2}s`,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
                <div ref={bottomRef} />
              </Paper>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="e.g. How do I change my plan?"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  sx={{ backgroundColor: '#fff', borderRadius: 1 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleMicClick}>
                          <MicIcon
                            sx={{
                              color: isRecording ? 'red' : 'inherit',
                              animation: isRecording ? 'blinker 1s linear infinite' : 'none',
                            }}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button variant="contained" onClick={handleSend} sx={{ minWidth: 50 }}>
                  <SendIcon />
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* FAQ Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 1, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Frequently Asked Questions
              </Typography>
              {faqs.map((faq, index) => (
                <Accordion key={index} sx={{ mb: 1, borderRadius: 2, backgroundColor: '#f9fafb' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1" >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <style jsx global>{`
        @keyframes blinker {
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </Box>
  );
};

export default FAQScreen;
