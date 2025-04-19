// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import LoadingPage from "../components/loadingScreen";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { FileText, Loader2, Github, Linkedin } from "lucide-react";
// import NavBar from "../components/NavBar";


// export default function AiResumeGenerator() {
//   const { data: session } = useSession();
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [latexOutput, setLatexOutput] = useState("");
//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);
//   const [showLoadingPage, setShowLoadingPage] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);

//   const user = session?.user as any;
//   const id = user?.id;

//   useEffect(() => {
//     const timer = setTimeout(() => setShowLoadingPage(false), 2000);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     const fetchResume = async () => {
//       if (!id) return;
  
//       try {
//         // Get full user
//         const userRes = await fetch(`http://52.15.58.198:3000/users/${id}`);
//         const user = await userRes.json();
  
//         let latex = user.generated_resume_latex;
  
//         console.log("📥 Raw fetched LaTeX:", latex);
  
//         // Try to unwrap if it's double-encoded
//         if (typeof latex === "string" && latex.trim().startsWith("{")) {
//           try {
//             const parsed = JSON.parse(latex);
//             latex = parsed.generated_resume_latex || latex;
//             console.log("✅ LaTeX unwrapped:", latex.slice(0, 300));
//           } catch (err) {
//             console.warn("⚠️ Failed to parse nested LaTeX. Using raw string.");
//           }
//         }
  
//         setLatexOutput(latex);
  
//         // Fetch PDF
//         const pdfRes = await fetch(`http://52.15.58.198:3000/recompile/${id}`);
//         const blob = await pdfRes.blob();
//         setPdfUrl(URL.createObjectURL(blob));
//       } catch (err) {
//         console.error("Failed to load saved resume:", err);
//       }
//     };
  
//     if (session?.user?.id) fetchResume();
//   }, [session]);
  

//   const handleSaveChanges = async () => {
//     if (!id || !latexOutput) return;
//     setIsSaving(true);
  
//     try {
//       console.log("📝 Starting Save Changes flow...");
  
//       // 🔁 STEP 1 — Fetch current user data so we can preserve all required fields (e.g., xp, name, etc.)
//       console.log("📥 Fetching full user data before update...");
//       const userDataRes = await fetch(`http://52.15.58.198:3000/users/${id}`);
//       const userData = await userDataRes.json();
  
//       if (!userData || userData.error) {
//         throw new Error("Failed to fetch user data");
//       }
  
//       // 🛠 STEP 2 — Create full update payload, only overriding generated_resume_latex
//       console.log("📤 Merging user data with updated LaTeX...");
//       const updatePayload = {
//         ...userData,
//         generated_resume_latex: latexOutput, //this could be causing error I am guessing
//       };
  
//       console.log("📦 Final payload to PUT /users/:id:", updatePayload);
  
//       // 📡 STEP 3 — Save updated user object with LaTeX
//       const userUpdateRes = await fetch(`http://52.15.58.198:3000/users/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatePayload),
//       });
  
//       console.log("✅ PUT /users/:id response:", userUpdateRes.status);
      
//       if (!userUpdateRes.ok) {
//         const errorText = await userUpdateRes.text();
//         console.error("❌ Failed to save LaTeX to user record:", errorText);
//         throw new Error("Failed to save LaTeX to user record");
//       }
  
//       // 🚀 STEP 4 — Trigger resume recompile with GET /recompile/:id
//       console.log("🚀 Calling GET /recompile/:id to regenerate PDF...");
//       const recompileRes = await fetch(`http://52.15.58.198:3000/recompile/${id}`);
      
//       console.log("✅ GET /recompile/:id response:", recompileRes.status);
  
//       if (!recompileRes.ok) {
//         const errorText = await recompileRes.text();
//         console.error("❌ Failed to fetch recompiled resume:", errorText);
//         throw new Error("Failed to recompile resume");
//       }
  
//       // 📥 STEP 5 — Decode LaTeX from header and update UI
//       const encodedHeader = recompileRes.headers.get("X-Latex-Code") || "";
//       console.log("📥 Raw X-Latex-Code from header:", encodedHeader);
//       const decodedLatex = decodeURIComponent(encodedHeader);
//       console.log("🧪 Decoded LaTeX (preview):", decodedLatex.slice(0, 200) + "...");
  
//       const blob = await recompileRes.blob();
//       const pdfUrl = URL.createObjectURL(blob);
//       console.log("📄 PDF Blob URL generated:", pdfUrl);
  
//       // 🎯 Final UI update
//       // setLatexOutput(decodedLatex);
//       setPdfUrl(pdfUrl);
  
//       console.log("✅ Resume successfully saved and recompiled!");
//     } catch (err) {
//       console.error("❌ Save or recompile failed:", err);
//       alert("Something went wrong while saving or recompiling.");
//     } finally {
//       setIsSaving(false);
//       console.log("🧯 Save flow ended.");
//     }
//   };
  
  

//   const handleGenerateResume = async () => {
//     setIsGenerating(true);
//     try {
//       if (!session?.user) throw new Error("No active session");
//       const { github_username, name: db_name, id } = session.user as any;

//       const res = await fetch(`http://52.15.58.198:3000/users/${id}/generateResume`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ github_username, db_name }),
//       });

//       if (!res.ok) throw new Error("Failed to generate resume");

//       const encodedLatex = res.headers.get("X-Latex-Code") || "";
//       const decodedLatex = decodeURIComponent(encodedLatex);
//       const blob = await res.blob();

//       setLatexOutput(decodedLatex);
//       setPdfUrl(URL.createObjectURL(blob));
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong while generating resume.");
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   if (showLoadingPage) return <LoadingPage />;

//   return (
//     <div className="h-screen w-full flex flex-col text-[#0f172a] font-nunito overflow-y-scroll">
//       <NavBar />
//       <div className="flex flex-col px-[24px] md:px-[64px] pt-[32px] gap-[32px]">
//         {/* Header */}
//         <section className="flex flex-row items-center justify-between mt-[-20px] ml-[-50px]">
//           <img src="/images/resumeJuno.png" alt="resume" className="w-[340px] h-[250px]" />
//           <div className="bg-[#fff] translate-x-[-300px]">
//             <h2 className="text-[24px] font-bold mt-[60px]">Create Resume with Juno</h2>
//             <p className="text-[#64748b] mt-[5px] text-[13px] max-w-[600px] translate-y-[-20px]">
//               Generate a professional resume based on your GitHub contributions and LinkedIn profile.
//             </p>
//           </div>
//           <Button
//             onClick={handleGenerateResume}
//             disabled={isGenerating}
//             className="w-[180px] bg-[#385773] border-none outline-none cursor-pointer hover:bg-[#739fc5]"
//           >
//             {isGenerating ? (
//               <>
//                 <Loader2 className="mr-2 h-[16px] w-[16px] animate-spin" />
//                 Generating...
//               </>
//             ) : (
//               "Generate Resume"
//             )}
//           </Button>
//         </section>

//         <section className="flex flex-row gap-[32px] h-[calc(100vh-140px)] mt-[-80px]">
//           {/* Left */}
//           <div className="w-[100%] flex flex-col gap-[10px]">
//             <Card className="bg-[#fff] mb-[10px]">
//               <CardHeader className="flex flex-row items-center justify-between">
//                 <div>
//                   <CardTitle className="text-[18px]">Your Resume (Editable)</CardTitle>
//                   <CardDescription className="text-[14px]">
//                     Edit LaTeX below and click "Save Changes" to update your resume.
//                   </CardDescription>
//                 </div>
//                 <Button
//                   onClick={handleSaveChanges}
//                   disabled={isSaving}
//                   className="text-[14px] px-[16px] bg-[#385773] hover:bg-[#739fc5] border-none outline-none"
//                 >
//                   {isSaving ? (
//                     <>
//                       <Loader2 className="mr-2 h-[16px] w-[16px] animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     "Save Changes"
//                   )}
//                 </Button>
//               </CardHeader>
//             </Card>
//             <div className="w-[100%] h-full flex flex-col gap-[10px] pr-[8px]">
//               <Card className="bg-[#fff] min-h-[300px] overflow-y-scroll">
//                 <CardContent className="p-[20px]">
//                   <textarea
//                     value={latexOutput}
//                     onChange={(e) => setLatexOutput(e.target.value)}
//                     className="w-full h-[240px] text-[14px] font-mono bg-[#f8fafc] p-[12px] rounded-md resize-none outline-none"
//                     placeholder="Your resume LaTeX code will appear here."
//                   />
//                 </CardContent>
//               </Card>

//               <h1>Preview</h1>
//               {pdfUrl && (
//                 <Card className="bg-[#fff] flex-grow">
//                   <CardContent className="p-[10px] h-full">
//                   <iframe
//                   src={pdfUrl}
//                   className="w-full h-[600px] rounded-md bg-white border-none"
//                   style={{
//                     backgroundColor: "white",
//                     border: "none",
//                     margin: 0,
//                     padding: 0,
//                   }}
//                   title="Resume Preview"
//                 />

//                   </CardContent>
//                 </Card>
//               )}
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import LoadingPage from "../components/loadingScreen";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import NavBar from "../components/NavBar";

export default function AiResumeGenerator() {
  const { data: session } = useSession();
  const [isGenerating, setIsGenerating] = useState(false);
  const [latexOutput, setLatexOutput] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showLoadingPage, setShowLoadingPage] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false); // 🔥 new state

  const user = session?.user as any;
  const id = user?.id;

  useEffect(() => {
    const timer = setTimeout(() => setShowLoadingPage(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchResume = async () => {
      if (!id) return;

      try {
        const userRes = await fetch(`http://52.15.58.198:3000/users/${id}`);
        const user = await userRes.json();

        let latex = user.generated_resume_latex;
        if (typeof latex === "string" && latex.trim().startsWith("{")) {
          try {
            const parsed = JSON.parse(latex);
            latex = parsed.generated_resume_latex || latex;
          } catch (err) {
            console.warn("⚠️ Failed to parse nested LaTeX. Using raw string.");
          }
        }

        if (latex) {
          setLatexOutput(latex);
          setHasGenerated(true); // resume exists
        }

        const pdfRes = await fetch(`http://52.15.58.198:3000/recompile/${id}`);
        const blob = await pdfRes.blob();
        setPdfUrl(URL.createObjectURL(blob));
      } catch (err) {
        console.error("Failed to load saved resume:", err);
      }
    };

    if (session?.user?.id) fetchResume();
  }, [session]);

  const handleGenerateResume = async () => {
    setIsGenerating(true);
    try {
      if (!session?.user) throw new Error("No active session");
      const { github_username, name: db_name, id } = session.user as any;

      const res = await fetch(`http://52.15.58.198:3000/users/${id}/generateResume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ github_username, db_name }),
      });

      if (!res.ok) throw new Error("Failed to generate resume");

      const encodedLatex = res.headers.get("X-Latex-Code") || "";
      const decodedLatex = decodeURIComponent(encodedLatex);
      const blob = await res.blob();

      setLatexOutput(decodedLatex);
      setPdfUrl(URL.createObjectURL(blob));
      setHasGenerated(true); // 🔥 trigger full UI
    } catch (err) {
      console.error(err);
      alert("Something went wrong while generating resume.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!id || !latexOutput) return;
    setIsSaving(true);

    try {
      const userDataRes = await fetch(`http://52.15.58.198:3000/users/${id}`);
      const userData = await userDataRes.json();

      const updatePayload = {
        ...userData,
        generated_resume_latex: latexOutput,
      };

      const userUpdateRes = await fetch(`http://52.15.58.198:3000/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      if (!userUpdateRes.ok) {
        const errorText = await userUpdateRes.text();
        throw new Error(errorText);
      }

      const recompileRes = await fetch(`http://52.15.58.198:3000/recompile/${id}`);
      if (!recompileRes.ok) throw new Error("Failed to recompile resume");

      const blob = await recompileRes.blob();
      const pdfUrl = URL.createObjectURL(blob);
      setPdfUrl(pdfUrl);
    } catch (err) {
      console.error("❌ Save or recompile failed:", err);
      alert("Something went wrong while saving or recompiling.");
    } finally {
      setIsSaving(false);
    }
  };

  if (showLoadingPage) return <LoadingPage />;

  // 🔥 Show intro cards if resume hasn't been generated
  if (!hasGenerated) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <NavBar />
        <div className="flex gap-[40px] mt-[50px]">
          {/* JUNO CARD */}
          <div className="h-[500px] w-[400px] bg-[#385773] text-[#fff] rounded-[20px] font-nunito flex flex-col items-center px-[20px] py-[30px]">
            <h3 className="text-[20px] mb-[10px] text-center mt-[35px]">
              GENERATE RESUME WITH JUNO
            </h3>
            <p className="text-center text-sm mb-[20px]">
              Let our smart assistant create a resume based on your GitHub contributions.
            </p>
            <img
              src="/images/resumeJuno.png"
              alt="resume"
              className="w-[280px] h-[250px] object-contain mb-[10px]"
            />
            <button
              className="w-[250px] h-[50px] bg-[#fff] text-[#385773] hover:bg-[#dedede] font-nunito text-[15px]
                        flex items-center justify-center gap-2 rounded-[10px] cursor-pointer border-none outlone-none"
              onClick={handleGenerateResume}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-[16px] w-[16px] animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Resume"
              )}
            </button>
          </div>

          {/* MANUAL CARD */}
          <div className="h-[500px] w-[400px] bg-[#385773] text-[#fff]  rounded-[20px] font-nunito flex flex-col items-center px-[20px] py-[30px]">
            <h3 className="text-[20px] mb-[10px] text-center mt-[35px]">
              UPLOAD MANUAL RESUME (Coming soon)
            </h3>
            <p className="text-center text-sm mb-[20px]">
              Or manually upload and edit your own LaTeX resume from scratch.
            </p>
            <img
              src="/images/Createyourown.png"
              alt="Manual Upload"
              className="w-[280px] h-[250px] object-contain mb-[10px]"
            />
            <button
              disabled
              className="w-[250px] h-[50px] bg-white text-black opacity-60 font-nunito text-[15px] rounded-[10px] cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 🔥 Resume has been generated — show full UI
  return (
    <div className="h-screen w-full flex flex-col text-[#0f172a] font-nunito overflow-y-scroll">
      <NavBar />
      <div className="flex flex-col px-[24px] md:px-[64px] pt-[32px] gap-[32px]">
        <section className="flex flex-row items-center justify-between mt-[-20px] ml-[-50px]">
          <img src="/images/resumeJuno.png" alt="resume" className="w-[340px] h-[250px]" />
          <div className="bg-[#fff] translate-x-[-300px]">
            <h2 className="text-[24px] font-bold mt-[60px]">Create Resume with Juno</h2>
            <p className="text-[#64748b] mt-[5px] text-[13px] max-w-[600px] translate-y-[-20px]">
              Generate a professional resume based on your GitHub contributions and LinkedIn profile.
            </p>
          </div>
          <Button
            onClick={handleGenerateResume}
            disabled={isGenerating}
            className="w-[180px] bg-[#385773] border-none outline-none cursor-pointer hover:bg-[#739fc5]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-[16px] w-[16px] animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Resume"
            )}
          </Button>
        </section>

        <section className="flex flex-row gap-[32px] h-[calc(100vh-140px)] mt-[-80px]">
          <div className="w-[100%] flex flex-col gap-[10px]">
            <Card className="bg-[#fff] mb-[10px]">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-[18px]">Your Resume (Editable)</CardTitle>
                  <CardDescription className="text-[14px]">
                    Edit LaTeX below and click "Save Changes" to update your resume.
                  </CardDescription>
                </div>
                <Button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="text-[14px] px-[16px] bg-[#385773] hover:bg-[#739fc5] border-none outline-none"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-[16px] w-[16px] animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardHeader>
            </Card>

            <div className="w-[100%] h-full flex flex-col gap-[10px] pr-[8px]">
              <Card className="bg-[#fff] min-h-[300px] overflow-y-scroll">
                <CardContent className="p-[20px]">
                  <textarea
                    value={latexOutput}
                    onChange={(e) => setLatexOutput(e.target.value)}
                    className="w-full h-[240px] text-[14px] font-mono bg-[#f8fafc] p-[12px] rounded-md resize-none outline-none"
                    placeholder="Your resume LaTeX code will appear here."
                  />
                </CardContent>
              </Card>

              <h1>Preview</h1>
              {pdfUrl && (
                <Card className="bg-[#fff] flex-grow">
                  <CardContent className="p-[10px] h-full">
                    <iframe
                      src={pdfUrl}
                      className="w-full h-[600px] rounded-md bg-white border-none"
                      style={{
                        backgroundColor: "white",
                        border: "none",
                        margin: 0,
                        padding: 0,
                      }}
                      title="Resume Preview"
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

