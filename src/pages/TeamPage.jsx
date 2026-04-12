import React from 'react';
import { Github, Linkedin, Database, Brain, Workflow } from 'lucide-react';

const TeamMember = ({ name, role, description, skills, imagePath, linkedin, github }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center text-center transition-all hover:shadow-xl hover:-translate-y-1">
    <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-blue-50">
      <img 
        src={imagePath || "/placeholder-user.png"} 
        alt={name} 
        className="w-full h-full object-cover"
      />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-1">{name}</h3>
    <p className="text-blue-600 text-sm font-semibold mb-4 uppercase tracking-wider">{role}</p>
    <p className="text-gray-600 text-sm mb-6 leading-relaxed min-h-[60px]">
      {description}
    </p>
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {skills.map((skill, index) => (
        <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[11px] font-medium border border-blue-100">
          {skill}
        </span>
      ))}
    </div>
    <div className="flex gap-5 mt-auto">
      <a href={github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
        <Github size={22} />
      </a>
      <a href={linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
        <Linkedin size={22} />
      </a>
    </div>
  </div>
);

const TeamPage = () => {
  const team = [
    {
      name: "Ashish Kumar",
      role: "System Architect & Backend Lead",
      description: "Led the signal extraction algorithm development, managed database architecture, and engineered the end-to-end system integration pipelines.",
      skills: ["Signal Processing", "Database Management", "System Architecture", "FastAPI"],
      imagePath: "/team/ashish.jpg", 
      github: "https://github.com/Ashishbadal-source",
      linkedin: "https://www.linkedin.com/in/ashish-badal-309746281/"
    },
    {
      name: "Muskan Kagzi",
      role: "AI/LLM Engineer",
      description: "Headed the intelligence layer by fine-tuning Large Language Models (LLMs) to provide structured clinical insights and natural language processing.",
      skills: ["LLM", "NLP", "Model Fine-tuning", "Prompt Engineering"],
      imagePath: "/team/muskan.jpg",
      github: "https://github.com/Muskan-kagzi",
      linkedin: "https://www.linkedin.com/in/muskan-goyal-859495331/"
    },
    {
      name: "Devesh",
      role: "ML & Data Scientist",
      description: "Drove the data strategy by curating high-quality medical datasets, implementing cleaning pipelines, and optimizing machine learning model accuracy.",
      skills: ["Model Training", "Data Cleaning", "Dataset Curation", "OpenCV"],
      imagePath: "/team/devesh.jpg",
      github: "https://github.com/me-dev52",
      linkedin: "https://www.linkedin.com/in/devesh-kumar-rai-3270a3288/"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            Meet Our Developers
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            A dedicated team from NIT Kurukshetra working at the intersection of Artificial Intelligence and Healthcare.
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {team.map((member, index) => (
            <TeamMember key={index} {...member} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;