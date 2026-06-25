import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  GraduationCap,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Bell,
  FileText,
  LogOut,
  User,
  AlertTriangle,
  Upload,
  X
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

interface Application {
  id: string;
  university: string;
  course: string;
  status: "pending" | "accepted" | "rejected";
  submittedDate: string;
}

interface UniversityDocuments {
  [universityName: string]: {
    pendingDocuments: string[];
    hasAllDocuments: boolean;
  };
}

const DEFAULT_PENDING_DOCUMENTS = ["ID Document", "Matric Certificate", "Proof of Payment"];

export function Dashboard() {
  const navigate = useNavigate();
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [showSubmitToast, setShowSubmitToast] = useState(() => {
    const flag = localStorage.getItem("justSubmitted");
    if (flag) { localStorage.removeItem("justSubmitted"); return true; }
    return false;
  });

  const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (!userId) return;

    const loadApplications = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/applications/${userId}`);
        if (!response.ok) return;

        const data = await response.json();
        const mappedApplications = (data || []).map((app: any) => ({
          id: String(app.id),
          university: app.university,
          course: app.course,
          status: app.status || "pending",
          submittedDate: app.submittedDate || new Date().toISOString(),
        }));

        setApplications(mappedApplications);
        localStorage.setItem("applications", JSON.stringify(mappedApplications));
      } catch {
        const fallback = JSON.parse(localStorage.getItem("applications") || "[]");
        setApplications(fallback);
      }
    };

    loadApplications();
  }, []);

  const baseNotifications = [
    { id: 1, message: "Application to UCT reviewed", time: "2 hours ago", unread: true },
    { id: 2, message: "New courses available for 2027", time: "1 day ago", unread: false },
    { id: 3, message: "Document upload reminder", time: "3 days ago", unread: false },
  ];

  const uniqueUniversities = [...new Set(applications.map((app) => app.university))];

  const universityDocuments = useMemo<UniversityDocuments>(() => {
    const storedDocuments = JSON.parse(localStorage.getItem("universityDocuments") || "{}") as UniversityDocuments;
    const normalizedDocuments: UniversityDocuments = { ...storedDocuments };

    uniqueUniversities.forEach((universityName) => {
      if (!normalizedDocuments[universityName]) {
        normalizedDocuments[universityName] = {
          pendingDocuments: [...DEFAULT_PENDING_DOCUMENTS],
          hasAllDocuments: false,
        };
      }
    });

    return normalizedDocuments;
  }, [uniqueUniversities]);

  const pendingDocNotifications = Object.entries(universityDocuments)
    .filter(([_, uniDocs]) => uniDocs.pendingDocuments.length > 0)
    .map(([uniName, uniDocs], index) => ({
      id: `pending-${index}`,
      message: `${uniDocs.pendingDocuments.length} document(s) needed for ${uniName}`,
      time: "Action required",
      unread: true,
    }));

  const notifications = [...pendingDocNotifications, ...baseNotifications];

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  useEffect(() => {
    localStorage.setItem("universityDocuments", JSON.stringify(universityDocuments));
  }, [universityDocuments]);

  const totalPendingDocuments = Object.values(universityDocuments).reduce((sum, uniDocs) => {
    return sum + uniDocs.pendingDocuments.length;
  }, 0);

  const handleUploadDocuments = (universityName: string) => {
    setUploadingFor(universityName);
  };

  const handleDocumentUpload = (universityName: string, file: File, docType: string) => {
    const updatedUniversityDocs = { ...universityDocuments };
    if (updatedUniversityDocs[universityName]) {
      const pendingDocs = updatedUniversityDocs[universityName].pendingDocuments.filter(
        (doc) => doc !== docType
      );
      updatedUniversityDocs[universityName] = {
        pendingDocuments: pendingDocs,
        hasAllDocuments: pendingDocs.length === 0,
      };
    }
    localStorage.setItem("universityDocuments", JSON.stringify(updatedUniversityDocs));
    window.location.reload();
  };

  return (
    <div className="min-h-screen">
      {showSubmitToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm">Application submitted successfully!</span>
          <button onClick={() => setShowSubmitToast(false)} className="ml-2 opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <header className="bg-white/95 backdrop-blur shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl">SKHUL Portal</h1>
              <p className="text-sm text-gray-600">Welcome, {userProfile.firstName || "Student"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Applications</p>
                <p className="text-3xl mt-1">{applications.length}</p>
              </div>
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Accepted</p>
                <p className="text-3xl mt-1">
                  {applications.filter(app => app.status === "accepted").length}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-3xl mt-1">
                  {applications.filter(app => app.status === "pending").length}
                </p>
              </div>
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Documents</p>
                <p className="text-3xl mt-1">{totalPendingDocuments}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl">My Applications</h2>
                <button
                  onClick={() => navigate("/apply")}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700"
                >
                  <Plus className="w-4 h-4" />
                  New Application
                </button>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg text-gray-600 mb-2">No applications yet</h3>
                  <p className="text-gray-500 mb-6">
                    Start your journey by applying to your dream university
                  </p>
                  <button
                    onClick={() => navigate("/apply")}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700"
                  >
                    Start Application
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {uniqueUniversities.map((universityName) => {
                    const uniApps = applications.filter((app) => app.university === universityName);
                    const uniDocs = universityDocuments[universityName];

                    return (
                      <div
                        key={universityName}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 border-b border-gray-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="mb-2">{universityName}</h3>
                              <div className="flex flex-wrap gap-2">
                                {uniApps.map((app) => (
                                  <div
                                    key={app.id}
                                    className="flex items-center gap-2 bg-white px-3 py-1 rounded-full text-xs border border-gray-200"
                                  >
                                    <span className="text-gray-700">{app.course}</span>
                                    {getStatusIcon(app.status)}
                                  </div>
                                ))}
                              </div>
                              <p className="text-gray-500 text-xs mt-2">
                                Submitted: {uniApps[0]?.submittedDate}
                              </p>
                            </div>
                          </div>
                        </div>

                        {uniDocs && uniDocs.pendingDocuments.length > 0 && (
                          <div className="p-4 bg-orange-50 border-b border-orange-200">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                                  <span className="text-sm text-orange-700">
                                    {uniDocs.pendingDocuments.length} document(s) pending for this university
                                  </span>
                                </div>
                                {uploadingFor === universityName ? (
                                  <div className="bg-white rounded p-3 space-y-2">
                                    {uniDocs.pendingDocuments.map((doc) => (
                                      <div key={doc} className="flex items-center justify-between gap-2">
                                        <span className="text-xs text-gray-600">{doc}</span>
                                        <input
                                          type="file"
                                          accept=".pdf,.jpg,.jpeg,.png"
                                          onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                              handleDocumentUpload(universityName, e.target.files[0], doc);
                                            }
                                          }}
                                          className="text-xs"
                                        />
                                      </div>
                                    ))}
                                    <button
                                      onClick={() => setUploadingFor(null)}
                                      className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1"
                                    >
                                      <X className="w-3 h-3" />
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <ul className="text-xs text-gray-600 space-y-1">
                                    {uniDocs.pendingDocuments.map((doc) => (
                                      <li key={doc} className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                        {doc}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                              {uploadingFor !== universityName && (
                                <button
                                  onClick={() => handleUploadDocuments(universityName)}
                                  className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                                >
                                  <Upload className="w-3 h-3" />
                                  Upload
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {uniDocs && uniDocs.hasAllDocuments && (
                          <div className="p-3 bg-green-50 text-center">
                            <div className="flex items-center justify-center gap-2 text-sm text-green-700">
                              <CheckCircle className="w-4 h-4" />
                              All documents submitted for this university
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl mb-6">Notifications</h2>
              <div className="space-y-4">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg border ${
                      notif.unread ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <p className="text-sm mb-1">{notif.message}</p>
                    <p className="text-xs text-gray-500">{notif.time}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <h2 className="text-xl mb-4">Profile</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Email:</span>
                  <span>{userProfile.email || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
