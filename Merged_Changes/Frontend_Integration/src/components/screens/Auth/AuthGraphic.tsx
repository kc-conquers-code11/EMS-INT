import React from 'react';

const imgCharacterBoy3 = "http://localhost:3845/assets/149e055c65d1eb59a3e997c09300f702331c7bc5.png";
const imgGroup2 = "http://localhost:3845/assets/d253dc02d5bc5d2c4722114281bb85dcbc0ccb16.png";
const img3DiconsNotebookDynamicColor = "http://localhost:3845/assets/616f7b93f4c52bb8f5a33e73abb91f5bdcc51a1b.png";
const imgVector7282 = "http://localhost:3845/assets/678e20030432b723b8e61a537a6f51b474dfd206.svg";

export const AuthGraphic = () => {
    return (
        <div 
            className="hidden lg:flex relative flex-1 w-full max-w-[500px] xl:max-w-[600px] h-[calc(100vh-64px)] max-h-[800px] min-h-[400px] rounded-[24px] shrink overflow-hidden shadow-[4px_4px_12px_-1px_rgba(0,0,0,0.25)] items-center justify-center"
            style={{ backgroundImage: "linear-gradient(149.83deg, #1C2157 36.34%, #2A3173 48.82%, #4750AC 73.47%, #404AB2 85.53%)" }}
        >
            <div className="relative w-[684px] h-[976px] shrink-0 scale-[0.55] lg:scale-[0.65] xl:scale-[0.75] origin-center">
                {/* Background glows / effects */}
                <div className="absolute left-1/2 top-[calc(50%+57px)] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl mix-blend-lighten pointer-events-none" />

                {/* Shadow overlay image */}
                <div className="absolute left-0 top-[276px] w-[656px] h-[700px] opacity-20 blur-[2px] pointer-events-none mix-blend-multiply">
                    <img src={imgCharacterBoy3} alt="" className="w-full h-full object-cover" />
                </div>

                {/* Dotted lines graphic */}
                <div className="absolute left-[53px] top-[113px] w-[641px] h-[592px] mix-blend-lighten pointer-events-none">
                    <img src={imgVector7282} alt="" className="w-[528px] h-[451px] object-contain opacity-50" />
                </div>

                {/* Main Character */}
                <div className="absolute left-[168px] top-[289px] w-[387px] h-[434px] drop-shadow-[0px_15px_4px_rgba(0,0,0,0.25)] z-10">
                    <img src={imgCharacterBoy3} alt="Student" className="w-full h-full object-contain" />
                </div>

                {/* Floating elements */}
                <div className="absolute left-[176px] top-[107px] w-[115px] h-[148px] drop-shadow-[0px_4px_13px_rgba(0,0,0,0.25)] z-20 hover:-translate-y-2 transition-transform duration-500">
                    <img src={imgGroup2} alt="Floating App" className="w-full h-full object-contain" />
                </div>

                <div className="absolute left-[529px] top-[266px] w-[132px] h-[132px] z-20 hover:-translate-y-2 transition-transform duration-500 flex items-center justify-center">
                    <div className="w-[98px] h-[98px] drop-shadow-[10px_10px_3px_rgba(0,0,0,0.25)] rotate-[27deg]">
                        <img src={img3DiconsNotebookDynamicColor} alt="Notebook" className="w-full h-full object-contain" />
                    </div>
                </div>

                {/* Glassmorphism Tags */}
                <div className="absolute left-[64px] top-[292px] w-[129px] h-[64px] rounded-[9px] border border-white/20 bg-white/10 backdrop-blur-md flex flex-col items-center justify-center z-20 hover:bg-white/20 transition-colors">
                    <span className="text-white text-[13px] font-bold tracking-[2.47px] uppercase leading-tight text-center">
                        Exam<br />Section
                    </span>
                </div>

                <div className="absolute left-[403px] top-[181px] w-[195px] h-[64px] rounded-[9px] border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center z-20 hover:bg-white/20 transition-colors">
                    <span className="text-white text-[11px] font-extrabold tracking-[2.09px] uppercase text-center w-[137px] leading-snug">
                        Controller of Examination
                    </span>
                </div>

                {/* Bottom Text and Line */}
                <div className="absolute bottom-[200px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 w-full z-20">
                    <p className="text-white text-[15px] font-light tracking-[2.85px] text-center uppercase">
                        Manage Exams Seamlessly
                    </p>
                    <div className="w-[353px] h-[15px] rounded-full bg-gradient-to-r from-[#17203b] via-[#4853a4] to-[#4853a4]/20 blur-[1px]" />
                </div>
            </div>
        </div>
    );
};
