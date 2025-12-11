import React from 'react';

const Features = () => {
  const features = [
    {
      title: 'Built for speed',
      description: 'Instantly sync your notes across devices',
      icon: '⚡',
    },
    {
      title: 'Video Calls',
      description: 'High-quality video calls with your team',
      icon: '📹',
    },
    {
      title: 'Screen Sharing',
      description: 'Share your screen with one click',
      icon: '🖥️',
    },
    {
      title: 'End-to-end encryption',
      description: 'Only you can access your notes',
      icon: '🔒',
    },
    {
      title: 'Easy Room Creation',
      description: 'Create meeting rooms instantly',
      icon: '🏠',
    },
    {
      title: 'Frictionless search',
      description: 'Easily recall and index past notes and ideas',
      icon: '🔍',
    },
  ];

  return (
    <div className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl hover:border-purple-500 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;