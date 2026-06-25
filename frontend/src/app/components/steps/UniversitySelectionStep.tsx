import { useState } from "react";
import { School, Plus, Trash2, Search, AlertCircle, CreditCard, CheckCircle } from "lucide-react";
import { ApplicationData } from "../ApplicationWizard";

interface Props {
  data: ApplicationData;
  onNext: (data: any) => void;
  onBack: () => void;
}

interface University {
  name: string;
  courses: string[];
}

const saUniversities = [
  "University of Johannesburg",
  "University of Cape Town",
  "University of Pretoria",
  "University of the Witwatersrand",
  "Stellenbosch University",
  "University of KwaZulu-Natal",
  "Tshwane University of Technology",
  "Cape Peninsula University of Technology",
  "Durban University of Technology",
  "Nelson Mandela University",
  "University of South Africa (UNISA)",
  "Rhodes University",
  "North-West University",
  "University of Limpopo",
  "University of Fort Hare",
  "Walter Sisulu University",
  "Central University of Technology",
  "Mangosuthu University of Technology",
  "Vaal University of Technology",
  "Sol Plaatje University",
  "University of Mpumalanga",
  "Sefako Makgatho Health Sciences University",
];

const coursesByCategory: Record<string, string[]> = {
  Engineering: [
    "Civil Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Chemical Engineering",
    "Industrial Engineering",
    "Computer Engineering",
    "Mining Engineering",
    "Metallurgical Engineering",
  ],
  "Information Technology": [
    "Computer Science",
    "Information Systems",
    "Software Engineering",
    "Data Science",
    "Cybersecurity",
    "Information Technology",
  ],
  Business: [
    "Business Administration",
    "Accounting",
    "Finance",
    "Marketing",
    "Human Resource Management",
    "Economics",
    "Management",
    "Supply Chain Management",
  ],
  "Health Sciences": [
    "Medicine (MBChB)",
    "Nursing",
    "Pharmacy",
    "Dentistry",
    "Physiotherapy",
    "Occupational Therapy",
    "Radiography",
    "Emergency Medical Care",
  ],
  Humanities: [
    "Psychology",
    "Social Work",
    "Law (LLB)",
    "Education",
    "English",
    "History",
    "Political Science",
    "Journalism",
  ],
  Sciences: [
    "Biotechnology",
    "Biochemistry",
    "Microbiology",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Environmental Science",
    "Geology",
  ],
};

const courseAPSRequirements: Record<string, number> = {
  "Medicine (MBChB)": 40,
  "Dentistry": 38,
  "Pharmacy": 35,
  "Civil Engineering": 32,
  "Mechanical Engineering": 32,
  "Electrical Engineering": 32,
  "Computer Science": 30,
  "Law (LLB)": 30,
  "Accounting": 28,
  "Business Administration": 26,
  "Psychology": 28,
  "Nursing": 26,
};

// Generate consistent fees for universities (60% have fees, 40% don't)
function getApplicationFee(universityName: string): number {
  if (!universityName) return 0;

  let hash = 0;
  for (let i = 0; i < universityName.length; i++) {
    hash = ((hash << 5) - hash) + universityName.charCodeAt(i);
    hash = hash & hash;
  }

  const hasFee = Math.abs(hash % 100) < 60;
  if (!hasFee) return 0;

  const feeAmount = 150 + (Math.abs(hash % 251));
  return Math.round(feeAmount / 10) * 10;
}

export function UniversitySelectionStep({ data, onNext, onBack }: Props) {
  const [universities, setUniversities] = useState<University[]>(
    data.universitySelection.universities.length > 0
      ? data.universitySelection.universities
      : [{ name: "", courses: [] }]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState<string>("");

  const userAps = data.academicResults.aps;

  const addUniversity = () => {
    if (universities.length < 5) {
      setUniversities([...universities, { name: "", courses: [] }]);
    }
  };

  const removeUniversity = (index: number) => {
    if (universities.length > 1) {
      setUniversities(universities.filter((_, i) => i !== index));
    }
  };

  const updateUniversity = (index: number, name: string) => {
    const newUniversities = [...universities];
    newUniversities[index] = { name, courses: [] };
    setUniversities(newUniversities);
    setErrors("");
  };

  const toggleCourse = (uniIndex: number, course: string) => {
    const newUniversities = [...universities];
    const currentCourses = newUniversities[uniIndex].courses;

    if (currentCourses.includes(course)) {
      newUniversities[uniIndex].courses = currentCourses.filter((c) => c !== course);
    } else {
      if (currentCourses.length < 3) {
        newUniversities[uniIndex].courses = [...currentCourses, course];
      }
    }

    setUniversities(newUniversities);
  };

  const validate = () => {
    const validUniversities = universities.filter((u) => u.name && u.courses.length > 0);

    if (validUniversities.length === 0) {
      setErrors("Please select at least one university and one course");
      return false;
    }

    for (const uni of validUniversities) {
      if (uni.courses.length === 0) {
        setErrors(`Please select at least one course for ${uni.name}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const validUniversities = universities.filter((u) => u.name && u.courses.length > 0);
      onNext({
        universitySelection: {
          universities: validUniversities,
        },
      });
    }
  };

  const filteredUniversities = saUniversities.filter((uni) =>
    uni.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2 flex items-center gap-2">
          <School className="w-6 h-6 text-blue-600" />
          University & Course Selection
        </h2>
        <p className="text-gray-600">Select up to 5 universities and 3 courses per university</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Your APS Score: {userAps}</strong>
          <br />
          Courses with APS requirements higher than your score are marked in red.
        </p>
      </div>

      <div className="space-y-6">
        {universities.map((university, uniIndex) => (
          <div
            key={uniIndex}
            className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
          >
            <div className="flex gap-3 items-start mb-4">
              <div className="flex-1">
                <label className="block text-sm mb-2">Select University</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={university.name || searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                    }}
                    onFocus={() => setSearchTerm("")}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search university..."
                    list={`universities-${uniIndex}`}
                  />
                  <datalist id={`universities-${uniIndex}`}>
                    {filteredUniversities.map((uni) => (
                      <option key={uni} value={uni} />
                    ))}
                  </datalist>
                </div>
                <select
                  value={university.name}
                  onChange={(e) => updateUniversity(uniIndex, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                >
                  <option value="">Or select from dropdown</option>
                  {saUniversities.map((uni) => (
                    <option
                      key={uni}
                      value={uni}
                      disabled={universities.some((u, i) => u.name === uni && i !== uniIndex)}
                    >
                      {uni}
                    </option>
                  ))}
                </select>
              </div>

              {universities.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeUniversity(uniIndex)}
                  className="p-3 text-red-600 hover:bg-red-50 rounded-lg mt-7"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {university.name && (
              <>
                <div className="mb-4">
                  {getApplicationFee(university.name) > 0 ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-blue-600 shrink-0" />
                      <div>
                        <p className="text-sm text-blue-900">
                          <strong>Application Fee:</strong> R{getApplicationFee(university.name)}
                        </p>
                        <p className="text-xs text-blue-700 mt-0.5">
                          Payment details will be provided in the next step
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                      <p className="text-sm text-green-900">
                        <strong>No Application Fee</strong>
                      </p>
                    </div>
                  )}
                </div>

                <label className="block text-sm mb-3">
                  Select Courses (up to 3) - {university.courses.length}/3 selected
                </label>
                <div className="space-y-3">
                  {Object.entries(coursesByCategory).map(([category, courses]) => (
                    <div key={category}>
                      <h4 className="text-sm text-gray-700 mb-2">{category}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {courses.map((course) => {
                          const apsReq = courseAPSRequirements[course] || 25;
                          const meetsRequirement = userAps >= apsReq;
                          const isSelected = university.courses.includes(course);

                          return (
                            <button
                              key={course}
                              type="button"
                              onClick={() => toggleCourse(uniIndex, course)}
                              disabled={
                                !isSelected && university.courses.length >= 3
                              }
                              className={`text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                                isSelected
                                  ? "bg-blue-100 border-blue-500 text-blue-900"
                                  : meetsRequirement
                                  ? "bg-white border-gray-300 hover:bg-gray-50"
                                  : "bg-red-50 border-red-300 text-red-700"
                              } ${
                                !isSelected && university.courses.length >= 3
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span>{course}</span>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded ${
                                      meetsRequirement
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                                  >
                                    APS {apsReq}
                                  </span>
                                  {!meetsRequirement && (
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {universities.length < 5 && (
        <button
          type="button"
          onClick={addUniversity}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200"
        >
          <Plus className="w-4 h-4" />
          Add Another University
        </button>
      )}

      {errors && <p className="text-red-500 text-sm">{errors}</p>}

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
