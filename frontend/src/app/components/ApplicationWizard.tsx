import { useState } from "react";
import { useNavigate } from "react-router";
import { GraduationCap, ArrowLeft } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
import { PersonalInfoStep } from "./steps/PersonalInfoStep";
import { AcademicResultsStep } from "./steps/AcademicResultsStep";
import { UniversitySelectionStep } from "./steps/UniversitySelectionStep";
import { ApplicationFeePaymentStep } from "./steps/ApplicationFeePaymentStep";
import { DocumentUploadStep } from "./steps/DocumentUploadStep";
import { ReviewSubmitStep } from "./steps/ReviewSubmitStep";

export interface ApplicationData {
  personalInfo: {
    firstName: string;
    lastName: string;
    idNumber: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    homeAddress: string;
    city: string;
    province: string;
    postalCode: string;
  };
  academicResults: {
    subjects: Array<{ name: string; mark: number }>;
    aps: number;
  };
  universitySelection: {
    universities: Array<{
      name: string;
      courses: string[];
    }>;
  };
  documents: {
    idDocument: File | null;
    matricCertificate: File | null;
    proofOfPayment: File | null;
  };
}

const steps = [
  { id: 1, name: "Personal Information", component: PersonalInfoStep },
  { id: 2, name: "Academic Results", component: AcademicResultsStep },
  { id: 3, name: "University & Course Selection", component: UniversitySelectionStep },
  { id: 4, name: "Application Fee Payment", component: ApplicationFeePaymentStep },
  { id: 5, name: "Document Upload", component: DocumentUploadStep },
  { id: 6, name: "Review & Submit", component: ReviewSubmitStep },
];

function getPrefilledPersonalInfo() {
  const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
  const savedPersonal = JSON.parse(localStorage.getItem("savedPersonalInfo") || "{}");
  return {
    firstName: savedPersonal.firstName || profile.firstName || "",
    lastName: savedPersonal.lastName || profile.lastName || "",
    idNumber: savedPersonal.idNumber || "",
    dateOfBirth: savedPersonal.dateOfBirth || "",
    gender: savedPersonal.gender || "",
    nationality: savedPersonal.nationality || "South African",
    homeAddress: savedPersonal.homeAddress || "",
    city: savedPersonal.city || "",
    province: savedPersonal.province || "",
    postalCode: savedPersonal.postalCode || "",
  };
}

export function ApplicationWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    personalInfo: getPrefilledPersonalInfo(),
    academicResults: {
      subjects: [],
      aps: 0,
    },
    universitySelection: {
      universities: [],
    },
    documents: {
      idDocument: null,
      matricCertificate: null,
      proofOfPayment: null,
    },
  });

  const CurrentStepComponent = steps[currentStep - 1].component;

  const handleNext = (stepData: any) => {
    setApplicationData({ ...applicationData, ...stepData });
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem("currentUserId");
    const universityDocuments = JSON.parse(localStorage.getItem("universityDocuments") || "{}");

    const pendingDocs = [] as string[];
    if (!applicationData.documents.idDocument) pendingDocs.push("ID Document");
    if (!applicationData.documents.matricCertificate) pendingDocs.push("Matric Certificate");
    if (!applicationData.documents.proofOfPayment) pendingDocs.push("Proof of Payment");

    try {
      for (const uni of applicationData.universitySelection.universities) {
        if (!universityDocuments[uni.name]) {
          universityDocuments[uni.name] = {
            pendingDocuments: pendingDocs,
            hasAllDocuments: pendingDocs.length === 0,
          };
        }

        for (const course of uni.courses) {
          await fetch(`${API_BASE_URL}/applications`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: userId ? Number(userId) : null,
              university: uni.name,
              course,
              status: "pending",
            }),
          });
        }
      }

      localStorage.setItem("universityDocuments", JSON.stringify(universityDocuments));
      localStorage.setItem("savedPersonalInfo", JSON.stringify(applicationData.personalInfo));
      localStorage.setItem("justSubmitted", "true");
      navigate("/dashboard");
    } catch {
      localStorage.setItem("universityDocuments", JSON.stringify(universityDocuments));
      localStorage.setItem("savedPersonalInfo", JSON.stringify(applicationData.personalInfo));
      localStorage.setItem("justSubmitted", "true");
      navigate("/dashboard");
    }
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <GraduationCap className="w-8 h-8" />
              <h1 className="text-2xl">University Application</h1>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>
                  Step {currentStep} of {steps.length}
                </span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between mt-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      currentStep > index + 1
                        ? "bg-white text-green-600"
                        : currentStep === index + 1
                        ? "bg-white text-blue-600"
                        : "bg-white/30 text-white"
                    }`}
                  >
                    {currentStep > index + 1 ? "✓" : step.id}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 h-1 mx-1 ${
                        currentStep > index + 1 ? "bg-white" : "bg-white/30"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <p className="text-sm mt-4 text-white/90">{steps[currentStep - 1].name}</p>
          </div>

          <div className="p-8">
            <CurrentStepComponent
              data={applicationData}
              onNext={handleNext}
              onBack={handleBack}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
