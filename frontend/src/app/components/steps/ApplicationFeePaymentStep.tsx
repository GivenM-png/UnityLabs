import { useState } from "react";
import { CreditCard, Building2, CheckCircle, AlertCircle, Copy, ArrowRight } from "lucide-react";
import { ApplicationData } from "../ApplicationWizard";

interface Props {
  data: ApplicationData;
  onNext: (data: any) => void;
  onBack: () => void;
}

// Generate consistent fees for universities (60% have fees, 40% don't)
function getApplicationFee(universityName: string): number {
  // Use university name to generate consistent hash
  let hash = 0;
  for (let i = 0; i < universityName.length; i++) {
    hash = ((hash << 5) - hash) + universityName.charCodeAt(i);
    hash = hash & hash;
  }

  // Use hash to determine if university has a fee (60% yes, 40% no)
  const hasFee = Math.abs(hash % 100) < 60;

  if (!hasFee) return 0;

  // Generate fee between R150 and R400
  const feeAmount = 150 + (Math.abs(hash % 251));
  return Math.round(feeAmount / 10) * 10; // Round to nearest R10
}

export function ApplicationFeePaymentStep({ data, onNext, onBack }: Props) {
  const [copied, setCopied] = useState(false);
  const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
  const studentId = userProfile.userId || "N/A";

  const universitiesWithFees = data.universitySelection.universities.map((uni) => ({
    ...uni,
    fee: getApplicationFee(uni.name),
  }));

  const paidUniversities = universitiesWithFees.filter((uni) => uni.fee > 0);
  const freeUniversities = universitiesWithFees.filter((uni) => uni.fee === 0);
  const totalAmount = paidUniversities.reduce((sum, uni) => sum + uni.fee, 0);

  const handleCopyReference = () => {
    const ta = document.createElement("textarea");
    ta.value = studentId;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({});
  };

  const handleSkip = () => {
    onNext({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-blue-600" />
          Application Fee Payment
        </h2>
        <p className="text-gray-600">Review application fees for selected universities</p>
      </div>

      {paidUniversities.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <p className="text-sm text-orange-800">
              <strong>Important:</strong> Applications will only be processed once payment reflects in the account.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {paidUniversities.length > 0 && (
          <div>
            <h3 className="mb-3 text-gray-900">Universities Requiring Payment</h3>
            <div className="space-y-3">
              {paidUniversities.map((uni, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-gray-900">{uni.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {uni.courses.length} course{uni.courses.length > 1 ? "s" : ""} selected
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg text-blue-600">R{uni.fee}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {freeUniversities.length > 0 && (
          <div>
            <h3 className="mb-3 text-gray-900">Universities with No Application Fee</h3>
            <div className="space-y-3">
              {freeUniversities.map((uni, index) => (
                <div
                  key={index}
                  className="bg-green-50 border border-green-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-gray-900">{uni.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {uni.courses.length} course{uni.courses.length > 1 ? "s" : ""} selected
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">No Application Fee</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {paidUniversities.length > 0 && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700">Total Amount Payable</span>
              <span className="text-2xl text-blue-600">R{totalAmount}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-gray-900">Banking Details</h3>
            </div>

            <div className="space-y-3 bg-white rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Bank:</span>
                  <p className="text-gray-900">FNB</p>
                </div>
                <div>
                  <span className="text-gray-600">Account Name:</span>
                  <p className="text-gray-900">Uni Applications Portal</p>
                </div>
                <div>
                  <span className="text-gray-600">Account Number:</span>
                  <p className="text-gray-900 font-mono">62700000000</p>
                </div>
                <div>
                  <span className="text-gray-600">Branch Code:</span>
                  <p className="text-gray-900 font-mono">250655</p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <span className="text-gray-600 text-sm">Payment Reference:</span>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-lg font-mono text-blue-700">{studentId}</p>
                  <button
                    type="button"
                    onClick={handleCopyReference}
                    className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                    title="Copy Reference"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-orange-700 mt-2">
                  ⚠️ Use your Student ID as the payment reference
                </p>
              </div>
            </div>

            <div className="mt-4 bg-blue-50 rounded-lg p-3 text-xs text-blue-800">
              <p>
                Make payment to the above account and keep your proof of payment. You can upload it in the next step or later from your dashboard.
              </p>
            </div>
          </div>
        </>
      )}

      {paidUniversities.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h3 className="text-lg text-green-900 mb-2">Great News!</h3>
          <p className="text-sm text-green-800">
            None of your selected universities require an application fee. You can proceed to the next step.
          </p>
        </div>
      )}

      <div className="flex justify-between pt-6 border-t">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <div className="flex gap-3">
          {paidUniversities.length > 0 && (
            <button
              type="button"
              onClick={handleSkip}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Skip for now
            </button>
          )}
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 flex items-center gap-2"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
}
