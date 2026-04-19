import React from 'react';
import skills from '@/data/skills.json'

const Skills = () => {
  const skillsData = skills;
  return (
    
      <div className='flex flex-col items-center justify-center h-full w-full'>
        <h1 className="w-4/5 uppercase p-2 pb-8 text-foreground text-sm md:text-sm font-light text-start avalon-bold uppercase tracking-[0.4em]">What I do</h1>
        <hr className="relative left-1/2 -translate-x-1/2 w-[100vw] border-secondary" />
        <div className="md:w-4/5 flex flex-col items-stretch justify-between bg-transparent w-full">
          {skillsData.map((skill) => (
            <React.Fragment key={skill.id}>
              <h1
                className="uppercase tracking-tighter text-foreground text-5xl md:text-7xl font-semibold text-start avalon-bold leading-[1] center-reveal-hover flex flex-col md:flex-row md:items-center justify-between w-full"
                data-text={skill.title} 
              >
                <span className='inline-block md:p-0'>{skill.title}</span> 
                <span className='text-sm tracking-wide md:w-1/3 flex items-center justify-end'>{skill.description}</span>
              </h1>
              <hr className="relative left-1/2 -translate-x-1/2 w-[100vw] border-secondary" />
            </React.Fragment>
          ))}
        </div>
      </div>
  );
};

export default Skills;
