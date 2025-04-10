// app/Survey/layout.tsx
import { SurveyProvider } from "../contexts/SurveyContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SurveyProvider>{children}</SurveyProvider>;
}
