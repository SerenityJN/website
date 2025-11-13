import React, { useEffect, useRef, useState } from "react";
import "../css/index.css";

const philippineProvinces = [
  "Abra", "Agusan del Norte", "Agusan del Sur", "Aklan", "Albay", "Antique", "Apayao", "Aurora", "Basilan",
  "Bataan", "Batanes", "Batangas", "Benguet", "Biliran", "Bohol", "Bukidnon", "Bulacan", "Cagayan",
  "Camarines Norte", "Camarines Sur", "Camiguin", "Capiz", "Catanduanes", "Cavite", "Cebu", "Cotabato",
  "Davao de Oro", "Davao del Norte", "Davao del Sur", "Davao Occidental", "Davao Oriental", "Dinagat Islands",
  "Eastern Samar", "Guimaras", "Ifugao", "Ilocos Norte", "Ilocos Sur", "Iloilo", "Isabela", "Kalinga",
  "La Union", "Laguna", "Lanao del Norte", "Lanao del Sur", "Leyte", "Maguindanao", "Marinduque",
  "Masbate", "Metro Manila", "Misamis Occidental", "Misamis Oriental", "Mountain Province", "Negros Occidental",
  "Negros Oriental", "Northern Samar", "Nueva Ecija", "Nueva Vizcaya", "Occidental Mindoro", "Oriental Mindoro",
  "Palawan", "Pampanga", "Pangasinan", "Quezon", "Quirino", "Rizal", "Romblon", "Samar", "Sarangani",
  "Siquijor", "Sorsogon", "South Cotabato", "Southern Leyte", "Sultan Kudarat", "Sulu", "Surigao del Norte",
  "Surigao del Sur", "Tarlac", "Tawi-Tawi", "Zambales", "Zamboanga del Norte", "Zamboanga del Sur", "Zamboanga Sibugay"
];

export default function EnrollmentForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [studentType, setStudentType] = useState("New Enrollee");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const formRef = useRef(null);
  const applyBtnRef = useRef(null);
  const formSectionRef = useRef(null);
  const navHomeRef = useRef(null);
  const navAppRef = useRef(null);

  const stepConfig = {
    "New Enrollee": ["Welcome", "Account", "Profile", "Education", "Family", "Uploads", "Review"],
    Transferee: ["Welcome", "Account", "Profile", "Education", "Family", "Uploads", "Review"],
    Returnee: ["Welcome", "Verify", "Readmission", "Review"],
  };

  const welcomeContent = {
    "New Enrollee": { title: "Welcome, New Enrollee!", requirements: (<ul><li>Learner Reference Number (LRN)</li><li>Grade 11 Report Card</li></ul>) },
    Transferee: { title: "Welcome, Transferee!", requirements: (<ul><li>Learner Reference Number (LRN)</li><li>Transcript of Records</li><li>Honorable Dismissal</li></ul>) },
    Returnee: { title: "Welcome Back, Returnee!", requirements: (<ul><li>Your Learner Reference Number (LRN)</li><li>Updated contact information</li></ul>) },
  };

  const uploadRequirements = {
    "New Enrollee": [
      { name: "birth_cert", label: "Birth Certificate (PDF or Image) *" },
      { name: "form137", label: "Form 137 (PDF or Image) *" },
      { name: "good_moral", label: "Good Moral Certificate (PDF or Image) *" },
      { name: "report_card", label: "Report Card (PDF or Image) *" },
    ],
    Transferee: [
      { name: "birth_cert", label: "Birth Certificate (PDF or Image) *" },
      { name: "transcript_records", label: "Transcript of Records (PDF or Image) *" },
      { name: "honorable_dismissal", label: "Honorable Dismissal (PDF or Image) *" },
    ],
    Returnee: [],
  };

  const activeSteps = stepConfig[studentType];
  const TOTAL_STEPS = activeSteps.length;
  const selectedContent = welcomeContent[studentType];

  useEffect(() => {
    const formSection = formSectionRef.current;
    const homeLink = navHomeRef.current;
    const appLink = navAppRef.current;
    function updateActiveNav() {
      if (!formSection || !homeLink || !appLink) return;
      const scrollPos = window.scrollY;
      const formTop = formSection.offsetTop - 200;
      homeLink.classList.toggle("active", scrollPos < formTop);
      appLink.classList.toggle("active", scrollPos >= formTop);
    }
    function revealOnScroll() {
      if (!formSection) return;
      const sectionTop = formSection.getBoundingClientRect().top;
      if (sectionTop < window.innerHeight - 150) formSection.classList.add("visible");
    }
    window.addEventListener("scroll", updateActiveNav);
    window.addEventListener("scroll", revealOnScroll);
    updateActiveNav();
    revealOnScroll();
    return () => {
      window.removeEventListener("scroll", updateActiveNav);
      window.removeEventListener("scroll", revealOnScroll);
    };
  }, []);

  useEffect(() => {
    const btn = applyBtnRef.current;
    const formSection = formSectionRef.current;
    if (!btn || !formSection) return;
    const onApplyClick = (e) => {
      e.preventDefault();
      setTimeout(() => formSection.scrollIntoView({ behavior: "smooth" }), 100);
    };
    btn.addEventListener("click", onApplyClick);
    return () => btn.removeEventListener("click", onApplyClick);
  }, []);

  useEffect(() => {
    if (currentStep === TOTAL_STEPS - 1) {
      populateReview();
    }
  }, [currentStep, studentType]);

  useEffect(() => {
    setCurrentStep(0);
    formRef.current?.reset();
    const privacyCheckbox = document.getElementById("privacy-consent-checkbox");
    if (privacyCheckbox) privacyCheckbox.checked = false;
  }, [studentType]);

  function handleNextClick(e) {
    e.preventDefault();
    if (submitting) return;
    if (currentStep === 0) {
      const consentCheckbox = document.getElementById("privacy-consent-checkbox");
      if (!consentCheckbox.checked) {
        alert("You must agree to the Data Privacy Notice to continue.");
        consentCheckbox.focus();
        return;
      }
    }
    const visibleFs = formRef.current.querySelector(`.form-step[data-step-index="${currentStep}"]`);
    if (visibleFs) {
      for (const input of visibleFs.querySelectorAll("input, select, textarea")) {
        if (!input.checkValidity()) {
          input.reportValidity();
          return;
        }
      }
    }
    if (currentStep >= TOTAL_STEPS - 1) {
      handleSubmit();
    } else {
      setCurrentStep((s) => s + 1);
    }
  }

  function handlePrevClick(e) {
    e.preventDefault();
    if (submitting) return;
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }

  function populateReview() {
    const q = (name) => formRef.current?.querySelector(`[name='${name}']`);
    const getFile = (name) => q(name)?.files?.[0]?.name || "Not uploaded";
    const safeSet = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value || "N/A";
    };
    safeSet("rev_student_type", studentType);
    if (studentType !== "Returnee") {
      safeSet("rev_lrn", q("lrn")?.value);
      safeSet("rev_name", `${q("firstname")?.value} ${q("middlename")?.value} ${q("lastname")?.value} ${q("suffix")?.value}`.replace(/\s+/g, " ").trim());
      safeSet("rev_email", q("email")?.value);
      safeSet("rev_phone", q("phone")?.value);
      safeSet("rev_birthdate", q("birthdate")?.value);
      safeSet("rev_age", q("age")?.value);
      safeSet("rev_sex", q("sex")?.value);
      safeSet("rev_status", q("status")?.value);
      safeSet("rev_nationality", q("nationality")?.value);
      safeSet("rev_religion", q("religion")?.value);
      safeSet("rev_pob", q("place_of_birth")?.value);
      safeSet("rev_address", `${q("lot_blk")?.value}, ${q("street")?.value}, ${q("barangay")?.value}, ${q("municipality")?.value}, ${q("province")?.value} ${q("zipcode")?.value}`);
    } else {
      safeSet("rev_lrn", q("returnee_lrn")?.value);
      safeSet("rev_name", "Returnee Student");
      safeSet("rev_email", q("returnee_email")?.value);
      safeSet("rev_phone", q("phone")?.value);
      safeSet("rev_reason_leaving", q("reason_leaving")?.value);
      safeSet("rev_reason_returning", q("reason_returning")?.value);
    }
    const reviewDocsContainer = document.getElementById("rev_docs_container");
    if (reviewDocsContainer) {
      reviewDocsContainer.innerHTML = "";
      if (uploadRequirements[studentType].length > 0) { // Only show uploaded docs if there are any
        uploadRequirements[studentType].forEach((doc) => {
          const p = document.createElement("p");
          p.innerHTML = `<strong>${doc.label.replace(" *", "")}:</strong> <span>${getFile(doc.name)}</span>`;
          reviewDocsContainer.appendChild(p);
        });
      } else {
         reviewDocsContainer.innerHTML = `<p>No documents to upload for ${studentType}s.</p>`;
      }
    }
  }

  async function handleSubmit() {
    if (!formRef.current || submitting) return;
    setSubmitting(true);
    try {
      const formData = new FormData(formRef.current);
      formData.append("student_status", studentType);
      const res = await fetch("http://localhost:5000/api/enroll", { method: "POST", body: formData });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Server error");
      setSuccess({ STD_ID: result.STD_ID, message: result.message || "Registered successfully" });
      setTimeout(() => document.getElementById("successMsg")?.scrollIntoView({ behavior: "smooth" }), 150);
    } catch (err) {
      alert("Submission failed: " + (err.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  }

  function handleRegisterAgain() {
    setSuccess(null);
    setStudentType("New Enrollee");
    setCurrentStep(0);
    formRef.current?.reset();
    const privacyCheckbox = document.getElementById("privacy-consent-checkbox");
    if (privacyCheckbox) privacyCheckbox.checked = false;
  }

  const renderCurrentStepContent = () => {
    const isReturnee = studentType === 'Returnee';
    const uploadStepIndex = activeSteps.indexOf("Uploads");
    const reviewStepIndex = activeSteps.indexOf("Review");

    return (
      <>
        <div data-step-index="0" style={{ display: currentStep === 0 ? "block" : "none" }} className="form-step">
          <div className="welcome-box"><h3>{selectedContent.title}</h3><p>To proceed, please be ready with the following:</p>{selectedContent.requirements}</div>
          <div className="privacy-consent-box"><h4>Data Privacy Notice</h4><p>By proceeding, you consent to the collection and processing of your personal data for legitimate school-related purposes, in accordance with the Data Privacy Act of 2012.</p><div className="consent-check"><input type="checkbox" id="privacy-consent-checkbox" required /><label htmlFor="privacy-consent-checkbox">I have read and agree to the Data Privacy Notice.</label></div></div>
        </div>
        {isReturnee ? (
          <>
            <div data-step-index="1" style={{ display: currentStep === 1 ? "block" : "none" }} className="form-step">
              <h3>Verify Your Identity</h3>
              <div className="form-group"><label>Learner Reference Number (LRN) *</label><input type="text" name="returnee_lrn" required maxLength="12" pattern="\d{12}" title="LRN must be 12 digits." /></div>
              <div className="form-group"><label>Email Address Used Before *</label><input type="email" name="returnee_email" required /></div>
              <div className="form-group"><label>Mobile Number *</label><input type="tel" name="phone" placeholder="09XXXXXXXXX" maxLength="11" required /></div>
            </div>
            <div data-step-index="2" style={{ display: currentStep === 2 ? "block" : "none" }} className="form-step">
              <h3>Readmission Form</h3>
              <div className="form-group"><label>Reason for Leaving *</label><textarea name="reason_leaving" rows="4" required placeholder="e.g., Transferred to another school, Family relocation, Stopped schooling, etc."></textarea></div>
              <div className="form-group"><label>Reason for Returning *</label><textarea name="reason_returning" rows="4" required placeholder="e.g., Moving back to the area, Decided to continue studies, etc."></textarea></div>
            </div>
          </>
        ) : (
          <>
            <div data-step-index="1" style={{ display: currentStep === 1 ? "block" : "none" }} className="form-step">
              <h3>Account Information</h3>
              <div className="form-group"><label>Email *</label><input type="email" name="email" required /></div>
              <div className="form-group"><label>Mobile Number *</label><input type="tel" name="phone" placeholder="09XXXXXXXXX" maxLength="11" required /></div>
              <div className="form-group"><label>Create Password *</label><input type="password" name="password" minLength="8" required /></div>
            </div>
            <div data-step-index="2" style={{ display: currentStep === 2 ? "block" : "none" }} className="form-step">
              <div className="form-grid">
                <h3 style={{ gridColumn: "1 / -1" }}>Personal Profile</h3>
                <div className="form-group" style={{ gridColumn: "1 / -1" }}><label>Learner Reference Number (LRN) *</label><input type="text" name="lrn" required maxLength="12" pattern="\d{12}" title="LRN must be 12 digits." /></div>
                <div className="form-group"><label>First Name *</label><input type="text" name="firstname" required /></div>
                <div className="form-group"><label>Last Name *</label><input type="text" name="lastname" required /></div>
                <div className="form-group"><label>Middle Name</label><input type="text" name="middlename" /></div>
                <div className="form-group"><label>Suffix</label><select name="suffix"><option value="">N/A</option><option>Jr.</option><option>Sr.</option><option>I</option><option>II</option><option>III</option></select></div>
                <div className="form-group"><label>Birthday *</label><input type="date" name="birthdate" required /></div>
                <div className="form-group"><label>Age *</label><input type="number" name="age" min="1" required /></div>
                <div className="form-group"><label>Gender *</label><select name="sex" required><option value="">-- Select --</option><option>Male</option><option>Female</option></select></div>
                <div className="form-group"><label>Civil Status *</label><select name="status" required><option value="">-- Select --</option><option>Single</option><option>Married</option><option>Widowed</option></select></div>
                <div className="form-group"><label>Nationality *</label><input type="text" name="nationality" defaultValue="Filipino" required /></div>
                <div className="form-group"><label>Religion *</label><input type="text" name="religion" required /></div>
                <div className="form-group" style={{ gridColumn: "1 / -1" }}><label>Place of Birth (Province) *</label><select name="place_of_birth" required><option value="">-- Select Province --</option>{philippineProvinces.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                <h3 style={{ gridColumn: "1 / -1", marginTop: '1rem' }}>Address Information</h3>
                <div className="form-group"><label>Block/Lot/House No. *</label><input type="text" name="lot_blk" required /></div>
                <div className="form-group"><label>Street *</label><input type="text" name="street" required /></div>
                <div className="form-group"><label>Barangay *</label><input type="text" name="barangay" required /></div>
                <div className="form-group"><label>Municipality/City *</label><input type="text" name="municipality" required /></div>
                <div className="form-group"><label>Province *</label><input type="text" name="province" required /></div>
                <div className="form-group"><label>ZIP Code *</label><input type="text" name="zipcode" required /></div>
              </div>
            </div>
            <div data-step-index="3" style={{ display: currentStep === 3 ? "block" : "none" }} className="form-step">
              <h3>Educational Background</h3>
              <div className="form-group"><label>Last School Attended *</label><input type="text" name="last_school" required /></div>
              <div className="form-group">
                <label>Year Level to Enroll In *</label>
                <select 
                  name="yearLevel" 
                  required 
                  defaultValue={studentType === "New Enrollee" ? "Grade 11" : ""}
                  disabled={studentType === "New Enrollee"}
                >
                  <option value="">-- Select --</option>
                  <option>Grade 11</option>
                  <option>Grade 12</option>
                </select>
              </div>
              <div className="form-group"><label>Preferred Strand *</label><select name="strand" required><option value="">-- Select --</option><option>TVL - EIM</option><option>TVL - Automotive</option><option>ACAD - HUMSS</option></select></div>
            </div>
            <div data-step-index="4" style={{ display: currentStep === 4 ? "block" : "none" }} className="form-step">
              <h3>Guardian Information</h3>
              <div className="form-group"><label>Guardian's Full Name *</label><input type="text" name="guardian_name" required /></div>
              <div className="form-group"><label>Guardian's Contact Number *</label><input type="tel" name="guardian_phone" placeholder="09XXXXXXXXX" maxLength="11" required /></div>
            </div>
          </>
        )}
        <div data-step-index={uploadStepIndex} style={{ display: currentStep === uploadStepIndex ? "block" : "none" }} className="form-step">
          <h3>Upload Your Documents</h3>
          {uploadRequirements[studentType].map((doc) => (<div className="form-group" key={doc.name}><label>{doc.label}</label><input type="file" name={doc.name} accept=".pdf, image/*" required /></div>))}
        </div>
        <div data-step-index={reviewStepIndex} style={{ display: currentStep === reviewStepIndex ? "block" : "none" }} className="form-step">
          <h3>Review Your Information</h3><p>Double-check all details before submitting.</p>
          <div className="review-section">
            <div className="review-grid">
              <p><strong>Applying as:</strong> <span id="rev_student_type"></span></p>
              <p><strong>LRN:</strong> <span id="rev_lrn"></span></p>
              <p><strong>Full Name:</strong> <span id="rev_name"></span></p>
              <p><strong>Email:</strong> <span id="rev_email"></span></p>
              <p><strong>Contact #:</strong> <span id="rev_phone"></span></p>
              {studentType !== 'Returnee' ? (<>
                <p><strong>Birthday:</strong> <span id="rev_birthdate"></span></p>
                <p><strong>Age:</strong> <span id="rev_age"></span></p>
                <p><strong>Gender:</strong> <span id="rev_sex"></span></p>
                <p><strong>Status:</strong> <span id="rev_status"></span></p>
                <p><strong>Nationality:</strong> <span id="rev_nationality"></span></p>
                <p><strong>Religion:</strong> <span id="rev_religion"></span></p>
                <p><strong>Place of Birth:</strong> <span id="rev_pob"></span></p>
                <p style={{gridColumn: '1 / -1'}}><strong>Address:</strong> <span id="rev_address"></span></p>
              </>) : (<>
                <p style={{gridColumn: '1 / -1'}}><strong>Reason for Leaving:</strong> <span id="rev_reason_leaving"></span></p>
                <p style={{gridColumn: '1 / -1'}}><strong>Reason for Returning:</strong> <span id="rev_reason_returning"></span></p>
              </>)}
            </div>
            <h4 style={{marginTop: '15px'}}>Uploaded Documents</h4>
            <div id="rev_docs_container"></div>
          </div>
        </div>
      </>
    );
  };
  
  return (
    <>
      <header><div className="logo-text">SVSHS Online Application</div><nav><ul><li><button ref={navHomeRef} className="active" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Home</button></li><li><button ref={navAppRef} onClick={() => document.querySelector("#apply")?.scrollIntoView({ behavior: "smooth" })}>Application</button></li></ul></nav></header>
      <section className="hero-section"><div className="hero-overlay"></div><div className="hero-content"><h1>Welcome to <span>Southville 8B Senior High School</span></h1><p>SVSHS Senior High School Online Application Portal</p><button ref={applyBtnRef} className="apply-now">Apply Now →</button></div></section>
      <section id="apply" className="form-section" ref={formSectionRef}>
        <div className="form-container">
          {success ? (<div className="success" id="successMsg"><h2>✅ Registration Complete</h2><p>{success.message}</p><p><strong>Reference Number:</strong> {success.STD_ID}</p><div style={{ marginTop: 20 }}><button type="button" onClick={handleRegisterAgain}>Register Another Student</button></div></div>) : (
            <>
              <h1>Student Registration</h1><p className="subtitle">Please select your status and complete the steps to enroll.</p>
              <div className="button-status">
                <ul><li><button className={studentType === "New Enrollee" ? "active" : ""} onClick={() => setStudentType("New Enrollee")}>New Enrollee</button></li></ul>
                <ul><li><button className={studentType === "Transferee" ? "active" : ""} onClick={() => setStudentType("Transferee")}>Transferee</button></li></ul>
                <ul><li><button className={studentType === "Returnee" ? "active" : ""} onClick={() => setStudentType("Returnee")}>Returnee</button></li></ul>
              </div>
              <div className="stepper">
                {activeSteps.map((title, index) => (<div key={index} className={`step ${index < currentStep ? "completed" : index === currentStep ? "active" : "pending"}`}><div className="icon"><i className="fas fa-check"></i></div><p>{title}</p></div>))}
              </div>
              <form id="regForm" ref={formRef} encType="multipart/form-data" onSubmit={(e) => e.preventDefault()}>
                {renderCurrentStepContent()}
                <div className="buttons">
                  <button type="button" id="prevBtn" onClick={handlePrevClick} disabled={submitting || currentStep === 0} style={{ visibility: currentStep === 0 ? "hidden" : "visible" }}>Back</button>
                  <button type="button" id="nextBtn" onClick={handleNextClick} disabled={submitting}>{currentStep === TOTAL_STEPS - 1 ? (submitting ? "Submitting..." : "Submit") : "Next"}</button>
                </div>
              </form>
            </>
          )}
        </div>
      </section>
    </>
  );
}