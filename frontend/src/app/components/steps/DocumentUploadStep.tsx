import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle } from "lucide-react";
import { ApplicationData } from "../ApplicationWizard";

interface Props {
  data: ApplicationData;
  onNext: (data: any) => void;
  onBack: () => void;
}

export function DocumentUploadStep({ data, onNext, onBack }: Props) {
  const [documents, setDocuments] = useState(data.documents);

  const idDocRef = useRef<HTMLInputElement>(null);
  const matricRef = useRef<HTMLInputElement>(null);
  const proofRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    field: keyof typeof documents,
    file: File | null
  ) => {
    setDocuments({ ...documents, [field]: file });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ documents });
  };

  const handleSkip = () => {
    onNext({
      documents: {
        idDocument: null,
        matricCertificate: null,
        proofOfPayment: null,
      }
    });
  };

  const renderUploadBox = (
    label: string,
    field: keyof typeof documents,
    description: string,
    ref: React.RefObject<HTMLInputElement>
  ) => {
    const file = documents[field];

    return (
      <div
        className={`border-2 border-dashed rounded-lg p-6 ${
          file
            ? "border-green-300 bg-green-50"
            : "border-gray-300 bg-white"
        }`}
      >
        <div className="text-center">
          <div className="mb-3 flex justify-center">
            {file ? (
              <CheckCircle className="w-12 h-12 text-green-600" />
            ) : (
              <Upload className="w-12 h-12 text-gray-400" />
            )}
          </div>

          <h3 className="mb-1">{label}</h3>
          <p className="text-sm text-gray-600 mb-4">{description}</p>

          {file ? (
            <div className="mb-3">
              <div className="flex items-center justify-center gap-2 text-sm text-green-700">
                <FileText className="w-4 h-4" />
                <span>{file.name}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          ) : null}

          <input
            ref={ref}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => ref.current?.click()}
            className={`px-6 py-2 rounded-lg border transition-colors ${
              file
                ? "border-green-600 text-green-600 hover:bg-green-100"
                : "border-blue-600 text-blue-600 hover:bg-blue-50"
            }`}
          >
            {file ? "Change File" : "Choose File"}
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Accepted formats: PDF, JPG, PNG (Max 5MB)
          </p>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          Document Upload
        </h2>
        <p className="text-gray-600">Upload supporting documents (optional - can be uploaded later)</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> You can skip this step and upload documents later from your dashboard.
          Ensure all documents are clear and legible. Accepted formats: PDF, JPG, PNG (Max 5MB).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderUploadBox(
          "ID Document",
          "idDocument",
          "Upload a certified copy of your South African ID",
          idDocRef
        )}

        {renderUploadBox(
          "Matric Certificate",
          "matricCertificate",
          "Upload your Grade 12 (Matric) certificate or results",
          matricRef
        )}

        {renderUploadBox(
          "Proof of Payment",
          "proofOfPayment",
          "Upload proof of application fee payment",
          proofRef
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm mb-2">Document Checklist (Optional - Can upload later):</h4>
        <ul className="text-sm text-blue-900 space-y-1">
          <li className="flex items-center gap-2">
            {documents.idDocument ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <div className="w-4 h-4 border-2 border-gray-400 rounded-full" />
            )}
            ID Document (Certified Copy)
          </li>
          <li className="flex items-center gap-2">
            {documents.matricCertificate ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <div className="w-4 h-4 border-2 border-gray-400 rounded-full" />
            )}
            Matric Certificate
          </li>
          <li className="flex items-center gap-2">
            {documents.proofOfPayment ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <div className="w-4 h-4 border-2 border-gray-400 rounded-full" />
            )}
            Proof of Payment
          </li>
        </ul>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSkip}
            className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
          >
            Skip for Now
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700"
          >
            Continue
          </button>
        </div>
      </div>
    </form>
  );
}
