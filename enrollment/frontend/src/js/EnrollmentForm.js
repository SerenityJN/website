document.addEventListener("DOMContentLoaded", () => {
    let currentStep = 0;
    let studentType = "New Enrollee";

    const philippineProvinces = [
        "Abra", "Agusan del Norte", "Agusan del Sur", "Aklan", "Albay", "Antique", "Apayao", "Aurora", "Basilan", "Bataan", "Batanes", "Batangas", "Benguet", "Biliran", "Bohol", "Bukidnon", "Bulacan", "Cagayan", "Camarines Norte", "Camarines Sur", "Camiguin", "Capiz", "Catanduanes", "Cavite", "Cebu", "Cotabato", "Davao de Oro", "Davao del Norte", "Davao del Sur", "Davao Occidental", "Davao Oriental", "Dinagat Islands", "Eastern Samar", "Guimaras", "Ifugao", "Ilocos Norte", "Ilocos Sur", "Iloilo", "Isabela", "Kalinga", "La Union", "Laguna", "Lanao del Norte", "Lanao del Sur", "Leyte", "Maguindanao", "Marinduque", "Masbate", "Metro Manila", "Misamis Occidental", "Misamis Oriental", "Mountain Province", "Negros Occidental", "Negros Oriental", "Northern Samar", "Nueva Ecija", "Nueva Vizcaya", "Occidental Mindoro", "Oriental Mindoro", "Palawan", "Pampanga", "Pangasinan", "Quezon", "Quirino", "Rizal", "Romblon", "Samar", "Sarangani", "Siquijor", "Sorsogon", "South Cotabato", "Southern Leyte", "Sultan Kudarat", "Sulu", "Surigao del Norte", "Surigao del Sur", "Tarlac", "Tawi-Tawi", "Zambales", "Zamboanga del Norte", "Zamboanga del Sur", "Zamboanga Sibugay"
    ];

    const stepConfig = {
        "New Enrollee": ["Welcome", "Account", "Profile", "Education", "Family", "Uploads", "Review"],
        Transferee: ["Welcome", "Account", "Profile", "Education", "Family", "Uploads", "Review"],
        Returnee: ["Welcome", "Verify", "Readmission", "Review"],
    };

    const welcomeContent = {
        "New Enrollee": { title: "Welcome, New Enrollee!", requirements: `<ul><li>Learner Reference Number (LRN)</li><li>Grade 11 Report Card</li></ul>` },
        Transferee: { title: "Welcome, Transferee!", requirements: `<ul><li>Learner Reference Number (LRN)</li><li>Transcript of Records</li><li>Honorable Dismissal</li></ul>` },
        Returnee: { title: "Welcome Back, Returnee!", requirements: `<ul><li>Your Learner Reference Number (LRN)</li><li>Updated contact information</li></ul>` },
    };

    const uploadRequirements = {
        "New Enrollee": [{ name: "birth_cert", label: "Birth Certificate (PDF or Image) *" }, { name: "form137", label: "Form 137 (PDF or Image) *" }, { name: "good_moral", label: "Good Moral Certificate (PDF or Image) *" }, { name: "report_card", label: "Report Card (PDF or Image) *" }],
        Transferee: [{ name: "birth_cert", label: "Birth Certificate (PDF or Image) *" }, { name: "transcript_records", label: "Transcript of Records (PDF or Image) *" }, { name: "honorable_dismissal", label: "Honorable Dismissal (PDF or Image) *" }],
        Returnee: [],
    };

    const form = document.getElementById("regForm");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const formSection = document.getElementById("apply");
    const stepperContainer = document.querySelector(".stepper");
    const typeButtons = document.querySelectorAll(".student-type-btn");
    const applicantStepsContainer = document.querySelector('.applicant-steps');
    const returneeStepsContainer = document.querySelector('.returnee-steps');
    const provinceSelect = document.getElementById('province-select');

    function updateUI() {
        const activeSteps = stepConfig[studentType];
        
        document.getElementById('welcome-title').textContent = welcomeContent[studentType].title;
        document.getElementById('welcome-requirements').innerHTML = welcomeContent[studentType].requirements;

        stepperContainer.innerHTML = activeSteps.map(title => `<div class="step"><div class="icon"><i class="fas fa-check"></i></div><p>${title}</p></div>`).join('');
        stepperContainer.querySelectorAll('.step').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index === currentStep) step.classList.add('active');
            if (index < currentStep) step.classList.add('completed');
        });

        applicantStepsContainer.style.display = (studentType === "Returnee") ? 'none' : 'block';
        returneeStepsContainer.style.display = (studentType === "Returnee") ? 'block' : 'block';

        document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
        
        let currentStepEl;
        if (currentStep === 0) {
            currentStepEl = document.querySelector('.form-step[data-step-index="0"]');
        } else if (currentStep === activeSteps.length - 1) {
            currentStepEl = document.getElementById('review-step');
        } else {
            const activeContainer = (studentType === "Returnee") ? returneeStepsContainer : applicantStepsContainer;
            currentStepEl = activeContainer.querySelector(`.form-step[data-step-index="${currentStep}"]`);
        }
        if (currentStepEl) currentStepEl.classList.add('active');

        const yearLevelSelect = document.getElementById('yearLevelSelect');
        if (studentType === 'New Enrollee') {
            yearLevelSelect.value = "Grade 11";
            yearLevelSelect.disabled = true;
        } else {
            yearLevelSelect.disabled = false;
        }

        prevBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
        nextBtn.textContent = currentStep === activeSteps.length - 1 ? 'Submit' : 'Next';
    }

    function handleNextClick() {
        if (nextBtn.disabled) return;

        if (currentStep === 0) {
            const consentCheckbox = document.getElementById("privacy-consent-checkbox");
            if (!consentCheckbox.checked) {
                alert("You must agree to the Data Privacy Notice to continue.");
                return;
            }
        }

        const activeStepEl = document.querySelector('.form-step.active');
        let isValid = true;
        if (activeStepEl) {
            activeStepEl.querySelectorAll('input, select, textarea').forEach(input => {
                if (!input.checkValidity()) {
                    input.reportValidity();
                    isValid = false;
                }
            });
        }
        if (!isValid) return;

        if (currentStep < stepConfig[studentType].length - 1) {
            currentStep++;
            if (currentStep === stepConfig[studentType].length - 1) {
                populateReview();
            }
            updateUI();
        } else {
            handleSubmit();
        }
    }

    function handlePrevClick() {
        if (currentStep > 0) {
            currentStep--;
            updateUI();
        }
    }

    function populateReview() {
        const q = (name) => form.querySelector(`[name='${name}']`);
        const getFile = (name) => q(name)?.files?.[0]?.name || "Not uploaded";
        const safeSet = (id, value) => { document.getElementById(id).textContent = value || "N/A"; };
        
        safeSet("rev_student_type", studentType);
        document.getElementById('review-applicant-details').style.display = studentType !== 'Returnee' ? 'contents' : 'none';
        document.getElementById('review-returnee-details').style.display = studentType === 'Returnee' ? 'contents' : 'none';

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
            safeSet("rev_phone", q("returnee_phone")?.value);
            safeSet("rev_reason_leaving", q("reason_leaving")?.value);
            safeSet("rev_reason_returning", q("reason_returning")?.value);
        }

        const reviewDocsContainer = document.getElementById("rev_docs_container");
        const currentUploads = uploadRequirements[studentType];
        if (currentUploads.length > 0) {
            reviewDocsContainer.innerHTML = currentUploads.map(doc => `<p><strong>${doc.label.replace(" *", "")}:</strong> <span>${getFile(doc.name)}</span></p>`).join('');
        } else {
            reviewDocsContainer.innerHTML = `<p>No documents are required for this application type.</p>`;
        }
    }

    function handleSubmit() {
        const formData = new FormData(form);

        formData.append("student_type", studentType);

        nextBtn.disabled = true;
        nextBtn.textContent = "Submitting...";

        fetch("https://website-backend-lxwz.onrender.com/api/enroll", {
            method: "POST",
            body: formData,
        })
        .then(async (res) => {
        const data = await res.json();
            if (data.success) {
                document.getElementById("form-content").style.display = "none";
                const success = document.getElementById("success-message");
                success.style.display = "block";
                document.getElementById("success-ref-id").textContent = data.reference;
                document.getElementById("success-text").textContent = data.message;
            } else {
                alert(data.message || "Submission failed. Please try again.");
            }
        })
        .catch(() => {
            alert("Error connecting to the server. Please check your internet or contact admin.");
        })
        .finally(() => {
            nextBtn.disabled = false;
            nextBtn.textContent = "Submit";
        });
    }


    provinceSelect.innerHTML = '<option value="">-- Select Province --</option>' + philippineProvinces.map(p => `<option value="${p}">${p}</option>`).join('');

    const applicantUploadsContainer = document.getElementById('applicant-uploads');
    applicantUploadsContainer.innerHTML = uploadRequirements['New Enrollee'].map(doc => 
        `<div class="form-group"><label>${doc.label}</label><input type="file" name="${doc.name}" accept=".pdf, image/*" required></div>`
    ).join('');

    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            typeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            studentType = btn.dataset.type;
            
            const currentUploads = uploadRequirements[studentType] || [];
            applicantUploadsContainer.innerHTML = currentUploads.map(doc => 
                `<div class="form-group"><label>${doc.label}</label><input type="file" name="${doc.name}" accept=".pdf, image/*" required></div>`
            ).join('');
            
            currentStep = 0;
            form.reset();
            updateUI();
        });
    });

    nextBtn.addEventListener('click', handleNextClick);
    prevBtn.addEventListener('click', handlePrevClick);
    
    document.getElementById('registerAgainBtn').addEventListener('click', () => {
        document.getElementById('form-content').style.display = 'block';
        document.getElementById('success-message').style.display = 'none';
        currentStep = 0;
        studentType = 'New Enrollee';
        typeButtons.forEach(b => b.classList.remove('active'));
        document.querySelector('.student-type-btn[data-type="New Enrollee"]').classList.add('active');
        form.reset();
        updateUI();
    });

    updateUI();

    const applyBtn = document.querySelector('.apply-now');
    const navButtons = document.querySelectorAll('.nav-btn');
    
    applyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        formSection.scrollIntoView({ behavior: 'smooth' });
    });

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (btn.dataset.target === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (btn.dataset.target === 'apply') {
                formSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    const revealOnScroll = () => {
        if(formSection.getBoundingClientRect().top < window.innerHeight - 150) {
            formSection.classList.add('visible');
        }
    };
    
    const updateActiveNav = () => {
        const scrollPos = window.scrollY;
        const formTop = formSection.offsetTop - 200;
        navButtons.forEach(b => b.classList.remove('active'));
        if (scrollPos >= formTop) {
            document.querySelector('.nav-btn[data-target="apply"]').classList.add('active');
        } else {
            document.querySelector('.nav-btn[data-target="home"]').classList.add('active');
        }
    };

    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('scroll', updateActiveNav);
    revealOnScroll();
    updateActiveNav();
});