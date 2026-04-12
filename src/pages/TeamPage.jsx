import React from 'react';
import { Github, Linkedin, Database, Brain, Workflow, Zap, Code2, Layers } from 'lucide-react';

const TeamMember = ({ name, role, description, skills, imagePath, linkedin, github, Icon }) => (
  <div className="group bg-white border border-gray-100 rounded-[2rem] p-8 flex flex-col items-center text-center transition-all duration-500 hover:shadow-[0_20px_50px_rgba(59,130,246,0.12)] hover:-translate-y-2 relative overflow-hidden">
    {/* Decorative background element for card */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    <div className="relative z-10">
      <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-[6px] border-blue-50/50 shadow-sm transition-transform duration-500 group-hover:scale-105">
        <img 
          src={imagePath || "/placeholder-user.png"} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="bg-blue-600 text-white p-2 rounded-xl absolute top-32 right-0 shadow-lg border-2 border-white transform translate-x-2 group-hover:translate-x-0 transition-transform duration-300">
        <Icon size={18} />
      </div>
    </div>

    <h3 className="text-2xl font-black text-gray-900 mb-1.5 tracking-tight">{name}</h3>
    <p className="text-blue-600 text-xs font-bold mb-4 uppercase tracking-[0.2em]">{role}</p>
    
    <p className="text-gray-500 text-sm mb-6 leading-relaxed font-medium px-2">
      {description}
    </p>

    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {skills.map((skill, index) => (
        <span key={index} className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-[10px] font-bold border border-gray-100 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-100 transition-colors">
          {skill}
        </span>
      ))}
    </div>

    <div className="flex gap-4 mt-auto pt-6 border-t border-gray-50 w-full justify-center">
      <a href={github} target="_blank" rel="noreferrer" className="p-2 rounded-full text-gray-400 hover:bg-gray-900 hover:text-white transition-all duration-300">
        <Github size={22} />
      </a>
      <a href={linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-full text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
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
      description: "Architected the end-to-end integration pipelines, optimized database schemas, and developed core signal extraction algorithms for high-precision clinical data.",
      skills: ["FastAPI", "Database Architecture", "Signal Extraction", "Pipeline Integration"],
      imagePath: "/team/ashish.jpg", 
      github: "https://github.com/Ashishbadal-source",
      linkedin: "https://www.linkedin.com/in/ashish-badal-309746281/",
      Icon: Workflow
    },
    {
      name: "Muskan Kagzi",
      role: "AI/LLM Engineer",
      description: "Pioneered the clinical reasoning engine by fine-tuning specialized Large Language Models to deliver explainable and structured medical insights.",
      skills: ["LLM Fine-tuning", "Prompt Engineering", "NLP", "Clinical Insights"],
      imagePath: "/team/muskan.jpg",
      github: "https://github.com/Muskan-kagzi",
      linkedin: "https://www.linkedin.com/in/muskan-goyal-859495331/",
      Icon: Brain
    },
    {
      name: "Devesh",
      role: "ML & Data Scientist",
      description: "Spearheaded multimodal data strategy, handling dataset curation and training complex CV models to ensure maximum diagnostic accuracy.",
      skills: ["Model Training", "Data Curation", "OpenCV", "Diagnostic Accuracy"],
      imagePath: "/team/devesh.jpg",
      github: "https://github.com/me-dev52",
      linkedin: "https://www.linkedin.com/in/devesh-kumar-rai-3270a3288/",
      Icon: Database
    }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative max-w-7xl mx-auto py-24 px-6">
        <header className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6 border border-blue-100">
            <Zap size={14} /> The Innovation Team
          </div>
          <h1 className="text-5xl md:text-7xl font-[1000] text-gray-900 mb-8 tracking-tighter leading-none">
            Built by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Visionaries.</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
            Engineering the future of healthcare from NIT Kurukshetra. Meet the experts behind MedInsight AI.
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {team.map((member, index) => (
            <TeamMember key={index} {...member} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;