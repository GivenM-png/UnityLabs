import { useState } from "react";
import { CheckCircle, Edit, FileText, School, User, BookOpen, Upload } from "lucide-react";
import { ApplicationData } from "../ApplicationWizard";

interface Props {
  data: ApplicationData;
  onNext?: (data: any) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function ReviewSubmitStep({ data, onBack, onSubmit }: Props) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);

      setTimeout(() => {
        onSubmit();
      }, 2000);
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="text-center py-12">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl mb-3 text-green-600">Application Submitted!</h2>
        <p className="text-gray-600 mb-6">
          Your application has been successfully submitted to the selected universities.
        </p>
        <p className="text-sm text-gray-500">
          You will receive confirmation emails shortly. Redirecting to dashboard...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          Review & Submit
        </h2>
        <p className="text-gray-600">Review your application before submitting</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Personal Information
            </h3>
            <button
              type="button"
              className="text-blue-600 text-sm flex items-center gap-1 hover:text-blue-700"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Name:</span>
              <p>
                {data.personalInfo.firstName} {data.personalInfo.lastName}
              </p>
            </div>
            <div>
              <span className="text-gray-600">ID Number:</span>
              <p>{data.personalInfo.idNumber}</p>
            </div>
            <div>
              <span className="text-gray-600">Date of Birth:</span>
              <p>{data.personalInfo.dateOfBirth}</p>
            </div>
            <div>
              <span className="text-gray-600">Gender:</span>
              <p>{data.personalInfo.gender}</p>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600">Address:</span>
              <p>
                {data.personalInfo.homeAddress}, {data.personalInfo.city},{" "}
                {data.personalInfo.province} {data.personalInfo.postalCode}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Academic Results
            </h3>
            <button
              type="button"
              className="text-blue-600 text-sm flex items-center gap-1 hover:text-blue-700"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>

          <div className="mb-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg">
              <span className="text-sm">Total APS Score:</span>
              <span className="text-xl">{data.academicResults.aps}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {data.academicResults.subjects.map((subject, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>{subject.name}</span>
                <span className="text-blue-600">{subject.mark}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2">
              <School className="w-5 h-5 text-blue-600" />
              University & Course Selections
            </h3>
            <button
              type="button"
              className="text-blue-600 text-sm flex items-center gap-1 hover:text-blue-700"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>

          <div className="space-y-4">
            {data.universitySelection.universities.map((uni, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="mb-2 text-blue-900">{uni.name}</h4>
                <ul className="text-sm space-y-1">
                  {uni.courses.map((course, cIndex) => (
                    <li key={cIndex} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {course}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              Documents
            </h3>
            <button
              type="button"
              className="text-blue-600 text-sm flex items-center gap-1 hover:text-blue-700"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>ID Document: {data.documents.idDocument?.name || "Uploaded"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>
                Matric Certificate: {data.documents.matricCertificate?.name || "Uploaded"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>
                Proof of Payment: {data.documents.proofOfPayment?.name || "Uploaded"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-900">
          <strong>Important:</strong> By submitting this application, you confirm that all
          information provided is accurate and complete. False information may result in
          disqualification.
        </p>
      </div>

      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="confirm"
          checked={isConfirmed}
          onChange={(e) => setIsConfirmed(e.target.checked)}
          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="confirm" className="text-sm">
          I confirm that all information provided is true and accurate to the best of my knowledge.
        </label>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!isConfirmed || isSubmitting}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Submit Application
            </>
          )}
        </button>
      </div>
    </form>
  );
}
