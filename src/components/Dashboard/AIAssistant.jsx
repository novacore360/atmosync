import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../UI/GlassCard';
import { useWeather } from '../../context/WeatherContext';
import { WiDaySunny, WiCloud, WiRain } from 'react-icons/wi';

const AIAssistant = () => {
  const { currentWeather, hourlyForecast } = useWeather();
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Hello! I'm your weather AI assistant. Ask me anything about the weather! For example:\n• Should I go outside?\n• Will it rain later?\n• What's the best time to jog?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateResponse(input.toLowerCase());
      setMessages(prev => [...prev, { type: 'bot', content: response }]);
      setIsTyping(false);
    }, 1000);
  };

  const generateResponse = (query) => {
    if (!currentWeather) {
      return "I'm sorry, I don't have current weather data right now. Please try again when weather data is loaded.";
    }

    const temp = currentWeather.temp;
    const condition = currentWeather.weather[0]?.main;
    const windSpeed = currentWeather.windSpeed;
    const humidity = currentWeather.humidity;

    if (query.includes('outside') || query.includes('go out')) {
      if (condition === 'Rain' || condition === 'Thunderstorm') {
        return `It's currently ${condition.toLowerCase()}ing with a temperature of ${temp}°C. I'd recommend staying indoors for now. Don't forget your umbrella if you must go out!`;
      } else if (temp > 35) {
        return `It's very hot outside at ${temp}°C. If you go out, make sure to wear sunscreen, stay hydrated, and avoid peak sun hours.`;
      } else if (temp < 5) {
        return `It's quite cold at ${temp}°C. Bundle up with warm layers if you're heading out!`;
      } else {
        return `The weather looks good! It's ${temp}°C with ${condition.toLowerCase()} skies. Perfect time to go outside!`;
      }
    }

    if (query.includes('rain')) {
      const rainChance = hourlyForecast?.[0]?.rainProbability || 0;
      if (rainChance > 50) {
        return `There's a ${rainChance}% chance of rain. I'd recommend carrying an umbrella with you.`;
      } else if (rainChance > 20) {
        return `There's a slight ${rainChance}% chance of rain. You might want to bring an umbrella just in case.`;
      } else {
        return `Rain is unlikely with only a ${rainChance}% chance. Enjoy your day!`;
      }
    }

    if (query.includes('jog') || query.includes('run') || query.includes('exercise')) {
      if (temp >= 15 && temp <= 25 && windSpeed < 15 && condition === 'Clear') {
        return `Now is a great time to jog! Temperature is perfect at ${temp}°C with clear skies and calm winds.`;
      } else if (temp > 30) {
        return `It's quite hot for jogging at ${temp}°C. Best time would be early morning (6-8 AM) or evening (6-8 PM) when it's cooler.`;
      } else if (temp < 10) {
        return `It's cold for outdoor exercise at ${temp}°C. Make sure to warm up properly and wear appropriate clothing.`;
      } else {
        return `Current conditions are ${condition.toLowerCase()} at ${temp}°C. ${condition === 'Clear' ? 'Good for outdoor activities!' : 'You might want to exercise indoors.'}`;
      }
    }

    // Default response
    return `Currently it's ${temp}°C with ${condition.toLowerCase()} skies. Humidity is at ${humidity}% and wind speed is ${windSpeed} m/s. Is there anything specific you'd like to know?`;
  };

  const suggestedQuestions = [
    "Should I go outside?",
    "Will it rain later?",
    "Best time to jog?",
    "Do I need sunscreen?",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassCard className="p-6">
        <div className="flex items-center mb-6">
          <div className="text-3xl mr-3">🤖</div>
          <h3 className="text-2xl font-bold text-white">AI Weather Assistant</h3>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-white/10 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  setInput(question);
                }}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/80 rounded-full text-sm transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about weather..."
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSend}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
          >
            Send
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default AIAssistant;
