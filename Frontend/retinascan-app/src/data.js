// 12 demo patients (levels 0-3)
export const allPatients = [
  // Level 0 (Healthy) – 3 patients
  { id: "#DR-88220", name: "Ram Kishore", age: 64, gender: "M", village: "PHC Mandawar", severity: 0, label: "No Apparent DR", confidence: 98.7, findings: "Clean vitreous, no lesions detected.", status: "Routine 12-mo" },
  { id: "#DR-88225", name: "Smt. Lakshmi Bai", age: 52, gender: "F", village: "Bassi CHC", severity: 0, label: "No Apparent DR", confidence: 97.2, findings: "Healthy fundus, clear macula.", status: "Cleared" },
  { id: "#DR-88226", name: "Ravi Kumar", age: 45, gender: "M", village: "Sanganer Camp", severity: 0, label: "No Apparent DR", confidence: 99.1, findings: "No abnormalities.", status: "Routine 12-mo" },
  // Level 1 (Mild) – 3 patients
  { id: "#DR-88221", name: "Fatima Dawood", age: 49, gender: "F", village: "Kishangarh Sub-Center", severity: 1, label: "Mild NPDR", confidence: 89.1, findings: "Isolated microaneurysms detected.", status: "Secondary Review" },
  { id: "#DR-88227", name: "Suresh Patel", age: 61, gender: "M", village: "Jamwa Ramgarh", severity: 1, label: "Mild NPDR", confidence: 91.4, findings: "Few dot-blot hemorrhages.", status: "Monitor" },
  { id: "#DR-88228", name: "Smt. Anjali Nair", age: 55, gender: "F", village: "Shahpura Sub-Center", severity: 1, label: "Mild NPDR", confidence: 88.3, findings: "Single microaneurysm in superior quadrant.", status: "Review" },
  // Level 2 (Moderate) – Geeta is the star demo patient
  { id: "#DR-88219", name: "Smt. Geeta Sharma", age: 58, gender: "F", village: "Alwar District", severity: 2, label: "Moderate NPDR", confidence: 96.4, findings: "14 microaneurysms, hemorrhages, hard exudates.", status: "Urgent Priority" },
  { id: "#DR-88229", name: "Mohan Lal", age: 67, gender: "M", village: "Tijara CHC", severity: 2, label: "Moderate NPDR", confidence: 94.8, findings: "Intraretinal hemorrhages in nasal quadrant.", status: "Needs Verification" },
  { id: "#DR-88230", name: "Smt. Sunita Devi", age: 51, gender: "F", village: "Bhiwadi Camp", severity: 2, label: "Moderate NPDR", confidence: 93.2, findings: "Hard exudates forming circinate rings.", status: "Priority" },
  // Level 3 (Severe) – 3 patients
  { id: "#DR-88222", name: "Iqbal Singh", age: 71, gender: "M", village: "Behror Mobile Unit", severity: 3, label: "Severe NPDR", confidence: 97.9, findings: "Cotton wool spots, venous beading.", status: "Immediate Referral" },
  { id: "#DR-88231", name: "Smt. Radha Rani", age: 63, gender: "F", village: "Neemrana SC", severity: 3, label: "Severe NPDR", confidence: 95.5, findings: "Intraretinal microvascular abnormalities.", status: "Critical" },
  { id: "#DR-88232", name: "Gopal Das", age: 59, gender: "M", village: "Kotputli CHC", severity: 3, label: "Severe NPDR", confidence: 98.0, findings: "Extensive hemorrhages > 4 quadrants.", status: "Ophthalmologist Required" },
];

// Severity colors (matches the mockups)
export const severityColors = {
  0: { bg: "#22c55e", label: "Healthy", text: "#ffffff", border: "#22c55e", tagBg: "#dcfce7", tagText: "#15803d" },
  1: { bg: "#eab308", label: "Mild", text: "#ffffff", border: "#eab308", tagBg: "#fef9c3", tagText: "#854d0e" },
  2: { bg: "#f97316", label: "Moderate", text: "#ffffff", border: "#f97316", tagBg: "#ffedd5", tagText: "#9a3412" },
  3: { bg: "#ef4444", label: "Severe", text: "#ffffff", border: "#ef4444", tagBg: "#fee2e2", tagText: "#991b1b" },
};

// 4 Preset Demo Patients for the Upload screen
export const demoPresets = [
  { id: "#DR-88220", name: "Priya S.", fullName: "Priya Sharma", age: 34, gender: "F", village: "PHC Mandawar", severity: 0, label: "No Apparent DR", confidence: 98.7, findings: "Clean vitreous, no lesions detected.", status: "Routine 12-mo" },
  { id: "#DR-88221", name: "Arjun M.", fullName: "Arjun Mehta", age: 49, gender: "M", village: "Kishangarh Sub-Center", severity: 1, label: "Mild NPDR", confidence: 89.1, findings: "Isolated microaneurysms detected.", status: "Secondary Review" },
  { id: "#DR-88219", name: "Geeta S. ★", fullName: "Smt. Geeta Sharma", age: 58, gender: "F", village: "Alwar District", severity: 2, label: "Moderate NPDR", confidence: 96.4, findings: "14 microaneurysms, hemorrhages, hard exudates.", status: "Urgent Priority" },
  { id: "#DR-88222", name: "Kiran D.", fullName: "Kiran Devi", age: 71, gender: "F", village: "Behror Mobile Unit", severity: 3, label: "Severe NPDR", confidence: 97.9, findings: "Cotton wool spots, venous beading.", status: "Immediate Referral" }
];

// Image paths pointing to local /public/images/
export const imagePaths = {
  0: { fundus: "/images/img_0_od.jpg", heatmap: "/images/heatmap_0_od.jpg" },
  1: { fundus: "/images/img_1_od.jpg", heatmap: "/images/heatmap_1_od.jpg" },
  2: { fundus: "/images/img_2_od.jpg", heatmap: "/images/heatmap_2_od.jpg" },
  3: { fundus: "/images/img_3_od.jpg", heatmap: "/images/heatmap_3_od.jpg" },
  4: { fundus: "/images/img_4_od.jpg", heatmap: "/images/heatmap_4_od.jpg" },
};

// Patient stories for demo narration
export const patientStories = {
  0: "Healthy retina. No diabetic retinopathy detected. Routine annual screening recommended.",
  1: "Mild Non-Proliferative DR. Isolated microaneurysms detected. Monitor annually.",
  2: "Moderate Non-Proliferative DR. Multiple microaneurysms, hemorrhages, and hard exudates. Refer to ophthalmologist.",
  3: "Severe Non-Proliferative DR. Extensive hemorrhages, cotton wool spots, and venous beading. Urgent specialist referral required.",
};
