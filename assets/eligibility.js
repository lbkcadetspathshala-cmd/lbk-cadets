/* =========================================================================
   LBK Cadets Pathshala — Eligibility Checker
   Data below is compiled from publicly available official notifications
   (NVS, Sainik School Society/AISSEE, RMS, RIMC, KVS, AMU, JMI, BHU) as a
   general GUIDE ONLY. Exact age cut-off dates & seat percentages change
   every admission cycle — always confirm with the official notification
   or during free counselling before filling any real application.
   ========================================================================= */

var COURSES = [
  {
    id: "navodaya",
    name: "Navodaya Vidyalaya (JNVST / LEST)",
    icon: "🏫",
    link: "courses/navodaya-vidyalaya-jnvst.html",
    entries: [
      { label: "Class VI (JNVST)", fromClass: 5, minAge: 9, maxAge: 13, note: "Rural/govt-school candidates get priority. Min. 75% rural quota, min. 1/3 girls, 27% OBC, SC/ST as per district population, Divyang as per norms." },
      { label: "Class IX (LEST)", fromClass: 8, minAge: 13, maxAge: 15, note: "Lateral entry — subject to seat vacancy in the district JNV." }
    ]
  },
  {
    id: "sainik",
    name: "Sainik School (AISSEE)",
    icon: "🎖️",
    link: "courses/sainik-school-aissee.html",
    entries: [
      { label: "Class VI (AISSEE)", fromClass: 5, minAge: 10, maxAge: 12, note: "Reservation: SC 15%, ST 7.5%, Defence/Ex-servicemen wards 25%, min. 10% seats for girls, Home-State quota ~67%." },
      { label: "Class IX (AISSEE)", fromClass: 8, minAge: 13, maxAge: 15, note: "Girls' admission to Class IX subject to seat availability. Same category quotas as Class VI apply." }
    ]
  },
  {
    id: "rms",
    name: "Rashtriya Military School (RMS)",
    icon: "⚔️",
    link: "courses/rashtriya-military-school-rms.html",
    entries: [
      { label: "Class VI (CET)", fromClass: 5, minAge: 10, maxAge: 12, note: "Selection via Common Entrance Test (English, Maths, GK, Intelligence) + physical fitness + medical. Wards of Defence personnel get priority quota." },
      { label: "Class IX (CET)", fromClass: 8, minAge: 13, maxAge: 15, note: "Same CET pattern with higher-level syllabus; physical & medical fitness compulsory." }
    ]
  },
  {
    id: "rimc",
    name: "Rashtriya Indian Military College (RIMC)",
    icon: "🎯",
    link: "courses/rimc.html",
    entries: [
      { label: "Class VIII Entry", fromClass: 7, minAge: 11.5, maxAge: 13, note: "Open to both boys & girls. Written test (English, Maths, GK) + Psychological test + Personal Interview + medical fitness. Limited state-wise quota (roughly 2 seats/state per term)." }
    ]
  },
  {
    id: "kv",
    name: "Kendriya Vidyalaya (KV)",
    icon: "🎓",
    link: "courses/kendriya-vidyalaya-kv.html",
    entries: [
      { label: "Class I (Lottery)", fromClass: 0, minAge: 6, maxAge: 8, note: "Admission via computerised draw of lots (no entrance test). Priority order: Defence/Ex-servicemen wards → KVS employee wards → Govt. employee wards → others." },
      { label: "Class II – IX (Vacancy)", fromClass: 1, minAge: 6, maxAge: 15, note: "Admission subject to seat vacancy in the relevant class. RTE 25%, SC 15%, ST 7.5%, OBC-NCL 27%, CWSN 3% reservation applies." }
    ]
  },
  {
    id: "amu",
    name: "AMU Schools",
    icon: "🕌",
    link: "courses/amu-schools.html",
    entries: [
      { label: "Class I (Draw of Lots)", fromClass: 0, minAge: 6, maxAge: 8, note: "Admission through draw of lots, no written test." },
      { label: "Class VI (Entrance Test)", fromClass: 5, minAge: 10, maxAge: 12, note: "Written entrance test — Maths, English, GK, Reasoning." },
      { label: "Class IX (Entrance Test)", fromClass: 8, minAge: 13, maxAge: 15, note: "Written entrance test conducted by AMU Controller of Examinations." }
    ]
  },
  {
    id: "jmi",
    name: "Jamia Millia Islamia (JMI) School",
    icon: "📖",
    link: "courses/jmi-school.html",
    entries: [
      { label: "Class VI", fromClass: 5, minAge: 10, maxAge: 12, note: "Admission via test/lottery at Jamia Senior Secondary School, Girls SSS or Syed Abid Husain SSS. Exact age cut-off is announced each year in the Jamia School Prospectus." },
      { label: "Class IX", fromClass: 8, minAge: 13, maxAge: 15, note: "Same schools as Class VI; check current year's prospectus for exact process (test/lottery mix varies by school)." }
    ]
  },
  {
    id: "chs",
    name: "Central Hindu School (CHS - BHU)",
    icon: "🏛️",
    link: "courses/chs-bhu.html",
    entries: [
      { label: "Class IX (SET)", fromClass: 8, minAge: 13, maxAge: 15, note: "School Entrance Test (SET) — qualifying marks 33% for General/OBC, 25% for SC/ST & Divyang (Orthopedically Handicapped)." }
    ]
  }
];

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('eligForm');
  if (!form) return;

  var resultsBox = document.getElementById('eligResults');
  var summaryBox = document.getElementById('eligSummary');

  function calcAge(dobStr) {
    var dob = new Date(dobStr);
    if (isNaN(dob.getTime())) return null;
    var today = new Date();
    var age = today.getFullYear() - dob.getFullYear();
    var m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  }

  function classToNum(clsStr) {
    var map = { "Nursery": -2, "LKG": -1, "UKG": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9 };
    return map.hasOwnProperty(clsStr) ? map[clsStr] : parseInt(clsStr, 10);
  }

  function statusFor(entry, age, currentClassNum) {
    // Age-based readiness
    var ageOk = age !== null && age >= entry.minAge - 0.6 && age <= entry.maxAge + 0.6;
    var classOk = currentClassNum !== null && (currentClassNum === entry.fromClass || currentClassNum === entry.fromClass - 1 || currentClassNum === entry.fromClass + 1);
    if (age !== null && age > entry.maxAge + 0.6) return "passed";
    if (age !== null && age < entry.minAge - 1.2) return "later";
    if (ageOk || classOk) return "now";
    return "info";
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fd = new FormData(form);
    var name = (fd.get('sname') || '').toString().trim();
    var dob = fd.get('sdob');
    var currentClass = fd.get('sclass');
    var category = fd.get('scategory') || 'General';
    var gender = fd.get('sgender') || 'Any';

    var age = calcAge(dob);
    var classNum = currentClass ? classToNum(currentClass) : null;

    var matchedCards = [];
    var eligibleCount = 0;

    COURSES.forEach(function (course) {
      course.entries.forEach(function (entry) {
        var status = statusFor(entry, age, classNum);
        if (status === "now") eligibleCount++;
        var catNote = "";
        if (category === "SC" || category === "ST") {
          catNote = "As " + category + " category, reserved-quota benefit may apply as per official notification (fee concession / relaxed cut-off in some courses).";
        } else if (category === "OBC") {
          catNote = "As OBC (Non-Creamy Layer), 27% reservation applies in several of these courses (subject to certificate submission).";
        } else if (category === "Defence/Ex-Servicemen Ward") {
          catNote = "As a Defence/Ex-Servicemen ward, you get priority quota in Sainik School, RMS and Kendriya Vidyalaya.";
        }
        matchedCards.push({ course: course, entry: entry, status: status, catNote: catNote });
      });
    });

    // Sort: "now" first, then "later", then "info", then "passed"
    var order = { now: 0, later: 1, info: 2, passed: 3 };
    matchedCards.sort(function (a, b) { return order[a.status] - order[b.status]; });

    var html = '';
    html += '<div class="elig-summary reveal show">';
    html += '<div><b>' + eligibleCount + '</b> <span>course entry point' + (eligibleCount === 1 ? '' : 's') + ' likely match' + (eligibleCount === 1 ? 'es' : '') + ' ' + (name ? name : 'this student') + ' right now</span></div>';
    html += '<a href="index.html#enroll" class="btn btn-cta">🎯 Book Free Counselling</a>';
    html += '</div>';
    html += '<div class="elig-grid">';

    matchedCards.forEach(function (m) {
      var statusLabel = { now: '✅ Eligible Now', later: '⏳ Eligible Later', passed: '❌ Age Limit Crossed', info: 'ℹ️ Check Details' }[m.status];
      var dimClass = m.status === 'passed' ? ' dim' : '';
      html += '<div class="elig-card' + dimClass + '">';
      html += '<div class="eic">' + m.course.icon + '</div>';
      html += '<div class="eb">';
      html += '<h4>' + m.course.name + ' — ' + m.entry.label + '</h4>';
      html += '<span class="estatus ' + m.status + '">' + statusLabel + '</span>';
      html += '<div class="emeta">Eligible age band: <b>' + m.entry.minAge + '–' + m.entry.maxAge + ' yrs</b> · Entry from Class ' + (m.entry.fromClass === 0 ? 'Nursery/Below' : m.entry.fromClass) + '</div>';
      html += '<div class="emeta">' + m.entry.note + '</div>';
      if (m.catNote) html += '<div class="ecat-note">🏷️ ' + m.catNote + '</div>';
      html += '<div class="erow"><a href="' + m.course.link + '">View Full Course Details →</a></div>';
      html += '</div></div>';
    });

    html += '</div>';
    html += '<div class="disc-box">⚠️ <b>Disclaimer:</b> Ye result sirf ek quick guide hai, based on generally published rules. Exact age cut-off dates, reservation percentages aur seat availability har admission cycle mein change hoti hain aur alag-alag hoti hain. Kripya final confirmation ke liye humein call/WhatsApp karein ya official notification dekhein — hamari free counselling team aapko exact eligibility batayegi.</div>';

    resultsBox.innerHTML = html;

    var wa = document.querySelector('[data-wa-eligresult]');
    if (wa) {
      var msg = "Namaste! Maine Eligibility Checker use kiya — " + (name || "mera bacche") + " (DOB: " + dob + ", Class: " + currentClass + ", Category: " + category + ") ke liye kaunse courses eligible hain, please guide karein.";
      wa.href = "https://wa.me/918859425252?text=" + encodeURIComponent(msg);
    }
  });
});
