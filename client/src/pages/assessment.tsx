import { Layout } from '@/components/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ClipboardList, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Assessment() {
  const { isDarkMode } = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isComplete, setIsComplete] = useState(false);

  const questions = [
    {
      question: "How often have you been feeling anxious or on edge?",
      options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      question: "How would you rate your overall mood this week?",
      options: ["Excellent", "Good", "Fair", "Poor"]
    },
    {
      question: "How well have you been sleeping recently?",
      options: ["Very well", "Fairly well", "Not very well", "Not well at all"]
    },
    {
      question: "Do you feel you have enough energy throughout the day?",
      options: ["Always", "Often", "Sometimes", "Rarely"]
    },
    {
      question: "How satisfied are you with your current stress management?",
      options: ["Very satisfied", "Satisfied", "Neutral", "Unsatisfied"]
    },
    {
      question: "How often do you engage in physical activity or exercise?",
      options: ["Daily", "3-4 times per week", "1-2 times per week", "Rarely or never"]
    },
    {
      question: "How would you describe your eating habits lately?",
      options: ["Very healthy", "Mostly healthy", "Somewhat unhealthy", "Very unhealthy"]
    },
    {
      question: "How often do you feel overwhelmed by your responsibilities?",
      options: ["Never", "Rarely", "Sometimes", "Often"]
    },
    {
      question: "Do you feel supported by your friends and family?",
      options: ["Very supported", "Somewhat supported", "Slightly supported", "Not supported"]
    },
    {
      question: "How satisfied are you with your work-life balance?",
      options: ["Very satisfied", "Satisfied", "Dissatisfied", "Very dissatisfied"]
    },
    {
      question: "How often do you practice mindfulness or meditation?",
      options: ["Daily", "Several times a week", "Occasionally", "Never"]
    },
    {
      question: "How would you rate your concentration and focus?",
      options: ["Excellent", "Good", "Fair", "Poor"]
    },
    {
      question: "Do you often feel sad or depressed?",
      options: ["Never", "Rarely", "Sometimes", "Often"]
    },
    {
      question: "How confident do you feel in handling personal problems?",
      options: ["Very confident", "Somewhat confident", "Not very confident", "Not at all confident"]
    },
    {
      question: "How often do you experience physical symptoms of stress (headaches, tension, etc.)?",
      options: ["Never", "Rarely", "Sometimes", "Frequently"]
    },
    {
      question: "How satisfied are you with your social relationships?",
      options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied"]
    },
    {
      question: "Do you feel you have a sense of purpose or meaning in life?",
      options: ["Strongly agree", "Agree", "Neutral", "Disagree"]
    },
    {
      question: "How often do you take time for self-care activities?",
      options: ["Daily", "Several times a week", "Occasionally", "Never"]
    },
    {
      question: "How would you rate your overall mental health?",
      options: ["Excellent", "Good", "Fair", "Poor"]
    },
    {
      question: "Are you optimistic about your future?",
      options: ["Very optimistic", "Somewhat optimistic", "Slightly pessimistic", "Very pessimistic"]
    }
  ];

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsComplete(false);
  };

  if (isComplete) {
    const score = Object.keys(answers).length;
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-6 pt-20 pb-32">
          <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-xl p-8 text-center`}>
            <CheckCircle2 className={`w-16 h-16 mx-auto mb-6 text-green-400`} />
            <h2 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} font-serif text-3xl mb-4`}>
              Assessment Complete
            </h2>
            <p className={`${isDarkMode ? 'text-white/70' : 'text-slate-700'} mb-6 text-lg`}>
              Thank you for completing the wellness assessment.
            </p>
            <div className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-md rounded-2xl p-6 border mb-8`}>
              <div className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} text-5xl font-bold mb-2`} data-testid="text-score">
                {score}/20
              </div>
              <p className={isDarkMode ? 'text-white/70' : 'text-slate-700'}>Questions Answered</p>
            </div>
            <div className="space-y-4">
              <p className={`${isDarkMode ? 'text-white/80' : 'text-slate-800'} text-left`}>
                Based on your responses, we recommend:
              </p>
              <ul className={`text-left space-y-2 ${isDarkMode ? 'text-white/70' : 'text-slate-700'}`}>
                <li>Daily 10-minute breathing exercises</li>
                <li>Join a support circle for community connection</li>
                <li>Try our guided meditation sessions</li>
                <li>Track your progress with daily check-ins</li>
              </ul>
            </div>
            <Button onClick={handleRestart} className="mt-8 gap-2" data-testid="button-restart">
              <ClipboardList className="w-5 h-5" />
              Take Another Assessment
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-6 pt-12 pb-32">
        <div className="mb-8">
          <h2 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} font-serif text-4xl mb-4`}>
            Wellness Assessment
          </h2>
          <p className={isDarkMode ? 'text-white/70' : 'text-slate-700'}>
            Help us understand your current state of mind
          </p>
        </div>

        <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-xl p-8 mb-6`}>
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm ${isDarkMode ? 'text-white/70' : 'text-slate-700'}`}>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className={`text-sm ${isDarkMode ? 'text-white/70' : 'text-slate-700'}`}>
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <h3 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} text-2xl mb-8 font-serif`}>
            {questions[currentQuestion].question}
          </h3>

          <RadioGroup value={answers[currentQuestion]} onValueChange={handleAnswer}>
            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index} className={`flex items-center space-x-3 p-4 rounded-lg transition-all hover-elevate ${
                  answers[currentQuestion] === option
                    ? isDarkMode ? 'bg-white/10 border-white/20' : 'bg-slate-900/10 border-slate-900/20'
                    : isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'
                } border backdrop-blur-md`}>
                  <RadioGroupItem value={option} id={`option-${index}`} data-testid={`radio-option-${index}`} />
                  <Label htmlFor={`option-${index}`} className={`flex-1 cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-slate-900'}`}>
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          <div className="flex gap-4 mt-8">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
              className="gap-2"
              data-testid="button-previous"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion]}
              className="flex-1 gap-2"
              data-testid="button-next"
            >
              {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
