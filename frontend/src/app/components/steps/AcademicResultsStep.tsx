import { useState, useEffect } from "react";
import { BookOpen, Calculator, Plus, Trash2, HelpCircle } from "lucide-react";
import { ApplicationData } from "../ApplicationWizard";

interface Props {
  data: ApplicationData;
  onNext: (data: any) => void;
  onBack: () => void;
}

interface Subject {
  name: string;
  mark: number;
}

const availableSubjects = [
  "Mathematics",
  "Mathematical Literacy",
  "Physical Sciences",
  "Life Sciences",
  "Accounting",
  "Business Studies",
  "Economics",
  "Geography",
  "History",
  "English Home Language",
  "English First Additional Language",
  "Afrikaans Home Language",
  "Afrikaans First Additional Language",
  "IsiZulu",
  "IsiXhosa",
  "Information Technology",
  "Computer Applications Technology",
  "Agricultural Sciences",
  "Life Orientation",
];

const calculateAPSPoints = (mark: number): number => {
  if (mark >= 80) return 7;
  if (mark >= 70) return 6;
  if (mark >= 60) return 5;
  if (mark >= 50) return 4;
  if (mark >= 40) return 3;
  if (mark >= 30) return 2;
  return 1;
};

export function AcademicResultsStep({ data, onNext, onBack }: Props) {
  const [subjects, setSubjects] = useState<Subject[]>(
    data.academicResults.subjects.length > 0
      ? data.academicResults.subjects
      : [{ name: "", mark: 0 }]
  );
  const [aps, setAps] = useState(data.academicResults.aps);
  const [errors, setErrors] = useState<string>("");
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const validSubjects = subjects.filter((s) => s.name && s.mark > 0);
    const totalAps = validSubjects.reduce((sum, subject) => {
      return sum + calculateAPSPoints(subject.mark);
    }, 0);
    setAps(totalAps);
  }, [subjects]);

  const addSubject = () => {
    if (subjects.length < 7) {
      setSubjects([...subjects, { name: "", mark: 0 }]);
    }
  };

  const removeSubject = (index: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((_, i) => i !== index));
    }
  };

  const updateSubject = (index: number, field: keyof Subject, value: string | number) => {
    const newSubjects = [...subjects];
    newSubjects[index] = { ...newSubjects[index], [field]: value };
    setSubjects(newSubjects);
    setErrors("");
  };

  const validate = () => {
    const validSubjects = subjects.filter((s) => s.name && s.mark > 0);
    if (validSubjects.length < 6) {
      setErrors("Please add at least 6 subjects with marks");
      return false;
    }

    const hasInvalidMarks = subjects.some((s) => s.name && (s.mark < 0 || s.mark > 100));
    if (hasInvalidMarks) {
      setErrors("All marks must be between 0 and 100");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const validSubjects = subjects.filter((s) => s.name && s.mark > 0);
      onNext({
        academicResults: {
          subjects: validSubjects,
          aps: aps,
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          Academic Results
        </h2>
        <p className="text-gray-600">Enter your Grade 12 subject results</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="mb-2">
            <strong>APS (Admission Point Score)</strong> is calculated by converting your subject
            marks to points:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>80-100% = 7 points</div>
            <div>70-79% = 6 points</div>
            <div>60-69% = 5 points</div>
            <div>50-59% = 4 points</div>
            <div>40-49% = 3 points</div>
            <div>30-39% = 2 points</div>
            <div>0-29% = 1 point</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {subjects.map((subject, index) => (
          <div key={index} className="flex gap-3 items-start">
            <div className="flex-1">
              <select
                value={subject.name}
                onChange={(e) => updateSubject(index, "name", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select subject</option>
                {availableSubjects.map((subj) => (
                  <option
                    key={subj}
                    value={subj}
                    disabled={subjects.some((s, i) => s.name === subj && i !== index)}
                  >
                    {subj}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-32">
              <input
                type="number"
                min="0"
                max="100"
                value={subject.mark || ""}
                onChange={(e) => updateSubject(index, "mark", parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mark %"
              />
            </div>

            <div className="w-20 px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-center">
              {subject.mark > 0 ? calculateAPSPoints(subject.mark) : "-"}
            </div>

            <button
              type="button"
              onClick={() => removeSubject(index)}
              className="p-3 text-red-600 hover:bg-red-50 rounded-lg"
              disabled={subjects.length === 1}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {subjects.length < 7 && (
        <button
          type="button"
          onClick={addSubject}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200"
        >
          <Plus className="w-4 h-4" />
          Add Subject
        </button>
      )}

      {errors && <p className="text-red-500 text-sm">{errors}</p>}

      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/90 mb-1">Your Total APS Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl">{aps}</span>
              <span className="text-xl">/ {subjects.length * 7}</span>
            </div>
          </div>
          <Calculator className="w-12 h-12 text-white/50" />
        </div>
        <p className="text-sm text-white/80 mt-3">
          Most universities require an APS of 25-35 depending on the course
        </p>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700"
        >
          Next Step
        </button>
      </div>
    </form>
  );
}
