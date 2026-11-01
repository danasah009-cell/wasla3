/* ==================================
   WASLA - APPLICATION DATA
================================== */

const KEY = "wasla_database";

const initialData = {
  role: "parent",
  page: "home",
  selectedChild: "sara",

  users: {
    parent: {
      name: "ريم العتيبي",
      role: "ولي الأمر"
    },
    supervisor: {
      name: "نورة الحربي",
      role: "مشرفة الحافلة"
    },
    admin: {
      name: "إدارة المدرسة",
      role: "الإدارة"
    }
  },

  children: [
    {
      id: "sara",
      name: "سارة العتيبي",
      grade: "الصف الثالث الابتدائي",
      bus: "حافلة 04",
      stop: "حي النزهة - شارع الأمير",
      barcode: "WS-2041",
      status: "على متن الحافلة"
    },
    {
      id: "lama",
      name: "لمى العتيبي",
      grade: "الصف الأول المتوسط",
      bus: "حافلة 04",
      stop: "حي النزهة - شارع الأمير",
      barcode: "WS-2042",
      status: "لم تصعد"
    }
  ],

  buses: [
    {
      id: "B04",
      name: "حافلة 04",
      driver: "أحمد القحطاني",
      supervisor: "نورة الحربي",
      plate: "أ ب ج 4821",
      capacity: 25,
      route: "النزهة ← المدرسة",
      status: "في الطريق"
    },
    {
      id: "B02",
      name: "حافلة 02",
      driver: "خالد الغامدي",
      supervisor: "هدى الزهراني",
      plate: "د هـ و 1932",
      capacity: 22,
      route: "الفيحاء ← المدرسة",
      status: "لم تبدأ"
    }
  ],

  trips: [
    {
      id: 1,
      date: "2026-11-01",
      period: "صباحية",
      bus: "حافلة 04",
      status: "في الطريق",
      start: "06:35",
      eta: "07:05",
      progress: 63,
      events: []
    }
  ],

  notifications: [
    {
      id: 1,
      title: "تم تسجيل صعود سارة",
      body: "تم تسجيل صعود سارة العتيبي إلى الحافلة 04",
      time: "06:42 ص",
      read: false
    },
    {
      id: 2,
      title: "الحافلة في الطريق",
      body: "حافلة 04 بدأت رحلتها إلى المدرسة",
      time: "06:35 ص",
      read: false
    },
    {
      id: 3,
      title: "تذكير بالرحلة",
      body: "موعد انطلاق الحافلة الصباحية اليوم 06:30 ص",
      time: "أمس",
      read: true
    }
  ],

  audit: []
};


/* ==================================
   LOAD AND SAVE
================================== */

function loadData() {
  try {
    const saved = localStorage.getItem(KEY);

    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error(error);
  }

  return JSON.parse(JSON.stringify(initialData));
}

let data = loadData();

function save() {
  localStorage.setItem(KEY, JSON.stringify(data));
  render();
}

const $ = selector => document.querySelector(selector);


/* ==================================
   NAVIGATION
================================== */

const navigation = {

  parent: [
    ["home", "الرئيسية", "⌂"],
    ["map", "خريطة الحافلة", "⌖"],
    ["trips", "رحلاتي", "▤"],
    ["history", "سجل الرحلات", "◷"],
    ["notifications", "الإشعارات", "♧"],
    ["settings", "الإعدادات", "⚙"]
  ],

  supervisor: [
    ["supervisor", "الرئيسية", "⌂"],
    ["students", "الطالبات", "♙"],
    ["scan", "تسجيل الباركود", "▦"],
    ["manage", "إدارة الرحلات", "⇄"],
    ["buses", "الحافلات والمسارات", "▣"],
    ["notifications", "الإشعارات", "♧"]
  ],

  admin: [
    ["admin", "لوحة الإدارة", "⌂"],
    ["students", "إدارة الطالبات", "♙"],
    ["manage", "إدارة الرحلات", "⇄"],
    ["buses", "إدارة الحافلات", "▣"],
    ["audit", "سجل التدقيق", "◷"],
    ["settings", "الإعدادات", "⚙"]
  ]

};

const pageTitles = {

  home: ["الرئيسية", "تابعي رحلة أبنائك من مكان واحد."],
  map: ["خريطة الحافلة", "موقع الحافلة ومسار الرحلة."],
  trips: ["رحلاتي", "تفاصيل الرحلات الحالية."],
  history: ["سجل الرحلات", "راجعي الرحلات السابقة."],
  notifications: ["الإشعارات", "كل تحديثات الرحلات."],
  settings: ["الإعدادات", "إدارة معلومات الحساب."],
  supervisor: ["لوحة المشرفة", "متابعة الحافلة والطالبات."],
  students: ["إدارة الطالبات", "بيانات الطالبات وحالة الصعود."],
  scan: ["تسجيل الباركود", "تسجيل صعود الطالبات ونزولهن."],
  manage: ["إدارة الرحلات", "التحكم في الرحلات المدرسية."],
  buses: ["الحافلات والمسارات", "إدارة الحافلات والسائقين."],
  admin: ["لوحة الإدارة", "نظرة عامة على نظام وصلة."],
  audit: ["سجل التدقيق", "مراجعة التعديلات والعمليات."]
};

function roleName() {
  return data.users[data.role].role;
}

function unreadCount() {
  return data.notifications.filter(n => !n.read).length;
}

function go(page) {
  data.page = page;
  save();
  window.scrollTo(0, 0);
  $("#sidebar").classList.remove("open");
}

function heading() {
  const title = pageTitles[data.page] || ["وصلة", ""];

  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">وصلة • ${roleName()}</div>
        <h1>${title[0]}</h1>
        <p>${title[1]}</p>
      </div>
    </div>
  `;
}

function navigationHTML(mobile = false) {

  const items = navigation[data.role];

  const shown = mobile ? items.slice(0, 5) : items;

  return shown.map(item => {

    const [id, label, icon] = item;

    return `
      <button
        class="nav-link ${data.page === id ? "active" : ""}"
        data-page="${id}"
      >
        <span class="nav-icon">${icon}</span>
        <span>${label}</span>

        ${
          id === "notifications" && unreadCount()
          ? `<span class="nav-count">${unreadCount()}</span>`
          : ""
        }
      </button>
    `;

  }).join("");
}


/* ==================================
   GENERAL COMPONENTS
================================== */

function statusTag(status) {

  let color = "";

  if (status.includes("لم")) {
    color = "wait";
  } else if (
    status.includes("انتهت") ||
    status.includes("إنزال")
  ) {
    color = "off";
  }

  return `<span class="tag ${color}">${status}</span>`;
}

function getChild() {

  return data.children.find(
    c => c.id === data.selectedChild
  ) || data.children[0];

}

function hero() {

  return `
    <section class="hero">

      <div class="hero-copy">

        <div class="eyebrow">
          وصلة معك في كل رحلة
        </div>

        <h2>
          مرحبًا، ${data.users[data.role].name}
        </h2>

        <p>
          تابعي تفاصيل الرحلة المدرسية
          واطمئني على وصول أبنائك.
        </p>

        <button
          class="btn btn-primary"
          data-page="${data.role === "parent" ? "map" : "manage"}"
        >
          متابعة الرحلة ←
        </button>

      </div>

      <div class="bus-scene">
        <span class="cloud"></span>
        <span class="school">🏫</span>
        <span class="bus-illustration">🚌</span>
      </div>

    </section>
  `;
}

function mapVisual() {

  return `
    <div class="map-visual">

      <div class="map-road"></div>

      <div class="map-pin start">
        <em>📍 نقطة الانطلاق</em>
      </div>

      <div class="map-pin end">
        <em>🏫 المدرسة</em>
      </div>

      <div class="map-pin bus">🚌</div>

    </div>

    <div class="map-legend">

      <span>
        <i class="legend-dot yellow"></i>
        موقع الحافلة (محاكاة)
      </span>

      <span>
        <i class="legend-dot"></i>
        مسار الرحلة
      </span>

      <span>
        <i class="legend-dot green"></i>
        نقطة الوصول
      </span>

    </div>
  `;
}

function notificationList(limit = 99) {

  return `
    <div class="list">

      ${
        data.notifications.slice(0, limit).map(n => `

          <div class="list-row">

            <span class="list-icon">♧</span>

            <div>
              <b>
                ${n.title}
                ${!n.read ? '<span class="tag wait">جديد</span>' : ""}
              </b>

              <small>${n.body}</small>
            </div>

            <span class="list-end">${n.time}</span>

          </div>

        `).join("")
      || `
        <div class="empty-state">
          لا توجد إشعارات
        </div>
      `}

    </div>
  `;
}

function tripTable(trips = data.trips) {

  return `
    <div class="table-wrap">

      <table>

        <thead>
          <tr>
            <th>التاريخ</th>
            <th>الفترة</th>
            <th>الحافلة</th>
            <th>وقت الانطلاق</th>
            <th>الحالة</th>
          </tr>
        </thead>

        <tbody>

          ${
            trips.map(t => `

              <tr>
                <td>${t.date}</td>
                <td>${t.period}</td>
                <td>${t.bus}</td>
                <td>${t.start}</td>
                <td>${statusTag(t.status)}</td>
              </tr>

            `).join("")
            ||
            `<tr><td colspan="5">لا توجد رحلات مسجلة</td></tr>`
          }

        </tbody>

      </table>

    </div>
  `;
}

function studentsTable(list = data.children) {

  return `
    <div class="table-wrap">

      <table>

        <thead>
          <tr>
            <th>الطالبة</th>
            <th>الباركود</th>
            <th>الحالة</th>
            <th>إجراء</th>
          </tr>
        </thead>

        <tbody>

          ${
            list.map(c => `

              <tr>
                <td>${c.name}</td>
                <td>${c.barcode}</td>
                <td>${statusTag(c.status)}</td>

                <td>
                  <button
                    class="btn btn-soft"
                    data-quick-scan="${c.barcode}"
                  >
                    تسجيل حركة
                  </button>
                </td>
              </tr>

            `).join("")
          }

        </tbody>

      </table>

    </div>
  `;
}


/* ==================================
   PARENT PAGES
================================== */

function homePage() {

  const c = getChild();
  const trip = data.trips[0];

  return `

    ${heading()}

    ${hero()}

    <div class="grid grid-2">

      <section class="card journey-card">

        <div class="card-title">

          <h2>حالة الرحلة الحالية</h2>

          <span class="status-pill">
            <i class="status-dot"></i>
            ${trip?.status || "لم تبدأ"}
          </span>

        </div>

        <div class="journey-main">

          <div>
            <strong>
              ${trip?.status === "في الطريق"
                ? "في الطريق"
                : trip?.status || "لم تبدأ الرحلة"}
            </strong>

            <small>${c.name} • ${c.bus}</small>
          </div>

          <div class="time-box">
            <b>${trip?.eta || "--:--"}</b>
            <small>وقت الوصول المتوقع</small>
          </div>

        </div>

        <div class="progress-track">
          <span style="width:${trip?.progress || 0}%"></span>
        </div>

        <div class="journey-foot">
          <span>نقطة الانطلاق</span>
          <span>${trip?.progress || 0}% من الرحلة</span>
          <span>المدرسة</span>
        </div>

      </section>

      <section class="card">

        <div class="card-title">
          <h3>بيانات الطالبة</h3>

          <button class="btn btn-soft" data-page="trips">
            عرض الكل
          </button>
        </div>

        <div class="profile-large">

          <div class="avatar">س</div>

          <div>
            <b>${c.name}</b>
            <small class="muted">${c.grade}</small>

            <div style="margin-top:6px">
              ${statusTag(c.status)}
            </div>
          </div>

        </div>

        <div class="list-row">
          <span class="list-icon">🚌</span>
          <div>
            <b>${c.bus}</b>
            <small>الحافلة المخصصة</small>
          </div>
        </div>

        <div class="list-row">
          <span class="list-icon">📍</span>
          <div>
            <b>${c.stop}</b>
            <small>نقطة الصعود</small>
          </div>
        </div>

      </section>

    </div>

    <div class="grid grid-2" style="margin-top:18px">

      <section class="card map-card">

        <div class="card-title">
          <h3>مسار الحافلة</h3>

          <button class="btn btn-soft" data-page="map">
            عرض الخريطة
          </button>
        </div>

        ${mapVisual()}

      </section>

      <section class="card">

        <div class="card-title">
          <h3>آخر الإشعارات</h3>

          <button class="btn btn-soft" data-page="notifications">
            عرض الكل
          </button>
        </div>

        ${notificationList(3)}

      </section>

    </div>

    <section class="card" style="margin-top:18px">

      <div class="card-title">
        <h3>الرحلات الأخيرة</h3>

        <button class="btn btn-soft" data-page="history">
          سجل الرحلات
        </button>
      </div>

      ${tripTable()}

    </section>

  `;
}


function mapPage() {

  const c = getChild();
  const trip = data.trips[0];

  return `

    ${heading()}

    <div class="grid grid-2">

      <section class="card map-card">

        <div class="card-title">
          <h3>خريطة الرحلة</h3>
          <span class="tag wait">موقع تجريبي</span>
        </div>

        ${mapVisual()}

        <p class="small muted">
          الموقع والمسار المعروضان محاكاة،
          ولا يمثلان GPS حقيقيًا.
        </p>

      </section>

      <section class="card">

        <div class="card-title">
          <h3>تفاصيل الرحلة</h3>
          ${statusTag(trip?.status || "لم تبدأ")}
        </div>

        <div class="list">

          <div class="list-row">
            <span class="list-icon">🚌</span>
            <div>
              <b>${c.bus}</b>
              <small>رقم الحافلة</small>
            </div>
          </div>

          <div class="list-row">
            <span class="list-icon">👨‍✈️</span>
            <div>
              <b>أحمد القحطاني</b>
              <small>السائق</small>
            </div>
          </div>

          <div class="list-row">
            <span class="list-icon">👩</span>
            <div>
              <b>نورة الحربي</b>
              <small>المشرفة</small>
            </div>
          </div>

          <div class="list-row">
            <span class="list-icon">⏱</span>
            <div>
              <b>${trip?.eta || "غير محدد"}</b>
              <small>وقت الوصول المتوقع</small>
            </div>
          </div>

        </div>

      </section>

    </div>

  `;
}


function tripsPage() {

  return `

    ${heading()}

    <div class="grid grid-2">

      ${data.children.map(c => `

        <section class="card">

          <div class="card-title">
            <h3>${c.name}</h3>
            ${statusTag(c.status)}
          </div>

          <p class="muted small">${c.grade}</p>

          <div class="list-row">
            <span class="list-icon">🚌</span>
            <div>
              <b>${c.bus}</b>
              <small>الحافلة</small>
            </div>
          </div>

          <div class="list-row">
            <span class="list-icon">📍</span>
            <div>
              <b>${c.stop}</b>
              <small>نقطة الصعود</small>
            </div>
          </div>

          <div class="list-row">
            <span class="list-icon">▦</span>
            <div>
              <b>${c.barcode}</b>
              <small>معرّف الطالبة</small>
            </div>
          </div>

          <button
            class="btn btn-primary"
            data-select-child="${c.id}"
          >
            عرض رحلة الطالبة
          </button>

        </section>

      `).join("")}

    </div>

    <section class="card" style="margin-top:18px">

      <div class="card-title">
        <h3>رحلات اليوم</h3>
      </div>

      ${tripTable()}

    </section>

  `;
}


function historyPage() {

  return `

    ${heading()}

    <section class="card">

      <div class="toolbar">

        <div class="field">
          <label>بحث بالتاريخ أو الحافلة</label>
          <input
            id="historySearch"
            placeholder="اكتبي كلمة للبحث..."
          >
        </div>

        <button class="btn btn-outline" id="exportTrips">
          تصدير السجل
        </button>

      </div>

      <div id="historyTable">
        ${tripTable()}
      </div>

    </section>

  `;
}


function notificationsPage() {

  return `

    ${heading()}

    <section class="card">

      <div class="card-title">

        <h3>كل الإشعارات</h3>

        <button class="btn btn-soft" id="markAllRead">
          تحديد الكل كمقروء
        </button>

      </div>

      ${notificationList()}

    </section>

  `;
}


function settingsPage() {

  return `

    ${heading()}

    <div class="grid grid-2">

      <section class="card">

        <div class="card-title">
          <h3>الملف الشخصي</h3>
        </div>

        <div class="field">
          <label>الاسم</label>
          <input
            id="profileName"
            value="${data.users[data.role].name}"
          >
        </div>

        <div class="field">
          <label>نوع الحساب</label>
          <input value="${roleName()}" disabled>
        </div>

        <button class="btn btn-primary" id="saveProfile">
          حفظ التغييرات
        </button>

      </section>

      <section class="card">

        <div class="card-title">
          <h3>تفضيلات الإشعارات</h3>
        </div>

        <div class="settings-row">
          <div>
            <b>إشعارات الصعود والنزول</b>
            <small>تحديثات حركة الطالبة</small>
          </div>
          <input class="toggle" type="checkbox" checked>
        </div>

        <div class="settings-row">
          <div>
            <b>تحديثات الرحلة</b>
            <small>بدء الرحلة والوصول</small>
          </div>
          <input class="toggle" type="checkbox" checked>
        </div>

        <div class="settings-row">
          <div>
            <b>التنبيهات الصوتية</b>
            <small>أصوات التنبيه داخل الموقع</small>
          </div>
          <input class="toggle" type="checkbox">
        </div>

      </section>

    </div>

  `;
}


/* ==================================
   SUPERVISOR PAGES
================================== */

function supervisorPage() {

  const onboard = data.children.filter(
    c => c.status === "على متن الحافلة"
  ).length;

  const notBoarded = data.children.filter(
    c => c.status === "لم تصعد"
  ).length;

  return `

    ${heading()}

    ${hero()}

    <div class="grid grid-4">

      <section class="card stat-card">
        <span class="stat-icon">♙</span>
        <div>
          <b>${data.children.length}</b>
          <small>إجمالي الطالبات</small>
        </div>
      </section>

      <section class="card stat-card">
        <span class="stat-icon">✓</span>
        <div>
          <b>${onboard}</b>
          <small>صعدن الحافلة</small>
        </div>
      </section>

      <section class="card stat-card">
        <span class="stat-icon">◷</span>
        <div>
          <b>${notBoarded}</b>
          <small>لم يصعدن</small>
        </div>
      </section>

      <section class="card stat-card">
        <span class="stat-icon">🚌</span>
        <div>
          <b>${data.buses.length}</b>
          <small>الحافلات</small>
        </div>
      </section>

    </div>

    <div class="grid grid-2" style="margin-top:18px">

      <section class="card">

        <div class="card-title">
          <h3>قائمة الطالبات</h3>

          <button class="btn btn-primary" data-page="scan">
            تسجيل باركود
          </button>
        </div>

        ${studentsTable()}

      </section>

      <section class="card">

        <div class="card-title">
          <h3>الرحلة النشطة</h3>
          ${statusTag(data.trips[0]?.status || "لم تبدأ")}
        </div>

        <div class="journey-main">

          <div>
            <strong>${data.trips[0]?.bus || "حافلة 04"}</strong>
            <small class="muted">الرحلة الصباحية</small>
          </div>

          <div class="time-box"
               style="background:#F4F0FA;color:var(--ink)">

            <b>${data.trips[0]?.progress || 0}%</b>
            <small class="muted">تقدم الرحلة</small>

          </div>

        </div>

        <div class="route-line">
          <span style="width:${data.trips[0]?.progress || 0}%"></span>
        </div>

        <button class="btn btn-soft" data-page="manage">
          إدارة الرحلة
        </button>

      </section>

    </div>

  `;
}


function studentsPage() {

  return `

    ${heading()}

    <section class="card">

      <div class="toolbar">

        <div class="field">
          <label>بحث عن طالبة</label>
          <input
            id="studentSearch"
            placeholder="الاسم أو رقم الباركود"
          >
        </div>

        <button class="btn btn-primary" id="addStudent">
          + إضافة طالبة
        </button>

      </div>

      <div id="studentsTable">
        ${studentsTable()}
      </div>

    </section>

  `;
}


function scanPage() {

  return `

    ${heading()}

    <div class="grid grid-2">

      <section class="card">

        <div class="card-title">
          <h3>قارئ الباركود</h3>
          <span class="tag wait">وضع تجريبي</span>
        </div>

        <div class="qr-box">

          <div class="qr-symbol">▦</div>

          <b>امسحي باركود الطالبة</b>

          <p class="muted small">
            وجّهي الكاميرا نحو الرمز أو أدخلي الرقم يدويًا.
          </p>

          <button class="btn btn-primary" id="startCamera">
            تشغيل الكاميرا
          </button>

          <div class="camera-frame" id="cameraFrame">
            <span>ستظهر معاينة الكاميرا هنا</span>
          </div>

        </div>

        <div class="field" style="margin-top:15px">

          <label>رقم الباركود / معرّف الطالبة</label>

          <input
            id="barcodeInput"
            placeholder="مثال: WS-2041"
          >

        </div>

        <div class="field">

          <label>نوع الحركة</label>

          <select id="scanType">
            <option value="boarding">تسجيل الصعود</option>
            <option value="dropoff">تسجيل النزول</option>
          </select>

        </div>

        <button
          class="btn btn-primary"
          id="submitBarcode"
          style="width:100%"
        >
          تسجيل الحركة
        </button>

      </section>

      <section class="card">

        <div class="card-title">
          <h3>حالة الطالبات</h3>
        </div>

        ${studentsTable()}

        <p class="muted small">
          يتحقق النظام من حالة الطالبة قبل تسجيل الحركة،
          ويمنع تكرار تسجيل الصعود أو النزول بالخطأ.
        </p>

      </section>

    </div>

  `;
}


function managePage() {

  const trip = data.trips[0];

  return `

    ${heading()}

    <div class="grid grid-2">

      <section class="card">

        <div class="card-title">
          <h3>التحكم بالرحلة</h3>
          ${statusTag(trip?.status || "لم تبدأ")}
        </div>

        <div class="field">

          <label>الحافلة</label>

          <select id="tripBus">

            ${data.buses.map(b => `
              <option ${trip?.bus === b.name ? "selected" : ""}>
                ${b.name}
              </option>
            `).join("")}

          </select>

        </div>

        <div class="field">

          <label>الفترة</label>

          <select id="tripPeriod">
            <option>صباحية</option>
            <option>مسائية</option>
          </select>

        </div>

        <div class="field">

          <label>تقدم الرحلة التجريبي (%)</label>

          <input
            id="tripProgress"
            type="range"
            min="0"
            max="100"
            value="${trip?.progress || 0}"
          >

        </div>

        <div class="toolbar">

          <button class="btn btn-primary" id="startTrip">
            بدء الرحلة
          </button>

          <button class="btn btn-soft" id="updateTrip">
            تحديث الحالة
          </button>

          <button class="btn btn-danger" id="endTrip">
            إنهاء الرحلة
          </button>

        </div>

        <p class="muted small">
          الموقع ووقت الوصول تجريبيان وليسا مرتبطين بنظام GPS.
        </p>

      </section>

      <section class="card">

        <div class="card-title">
          <h3>الطالبات وحالة التسجيل</h3>
        </div>

        ${studentsTable()}

      </section>

    </div>

    <section class="card" style="margin-top:18px">

      <div class="card-title">
        <h3>سجل الرحلات</h3>
      </div>

      ${tripTable()}

    </section>

  `;
}


function busesPage() {

  return `

    ${heading()}

    <div class="grid grid-2">

      ${data.buses.map(b => `

        <section class="card">

          <div class="card-title">
            <h3>${b.name}</h3>
            ${statusTag(b.status)}
          </div>

          <div class="list-row">
            <span class="list-icon">🚐</span>
            <div>
              <b>${b.plate}</b>
              <small>رقم اللوحة</small>
            </div>
          </div>

          <div class="list-row">
            <span class="list-icon">👨‍✈️</span>
            <div>
              <b>${b.driver}</b>
              <small>السائق</small>
            </div>
          </div>

          <div class="list-row">
            <span class="list-icon">👩</span>
            <div>
              <b>${b.supervisor}</b>
              <small>المشرفة</small>
            </div>
          </div>

          <div class="list-row">
            <span class="list-icon">♙</span>
            <div>
              <b>${b.capacity} مقعدًا</b>
              <small>السعة</small>
            </div>
          </div>

          <p class="small muted">
            المسار: ${b.route}
          </p>

          <button
            class="btn btn-soft"
            data-edit-bus="${b.id}"
          >
            تعديل بيانات السائق
          </button>

        </section>

      `).join("")}

      <section class="card">

        <div class="card-title">
          <h3>إضافة حافلة</h3>
        </div>

        <div class="field">
          <label>اسم الحافلة</label>
          <input id="newBusName" placeholder="حافلة 06">
        </div>

        <div class="field">
          <label>اسم السائق</label>
          <input id="newBusDriver" placeholder="اسم السائق">
        </div>

        <div class="field">
          <label>اسم المشرفة</label>
          <input id="newBusSupervisor" placeholder="اسم المشرفة">
        </div>

        <button class="btn btn-primary" id="addBus">
          إضافة الحافلة
        </button>

      </section>

    </div>

  `;
}


/* ==================================
   ADMIN PAGES
================================== */

function adminPage() {

  return `

    ${heading()}

    ${hero()}

    <div class="grid grid-4">

      <section class="card stat-card">
        <span class="stat-icon">🚌</span>
        <div>
          <b>${data.buses.length}</b>
          <small>الحافلات المسجلة</small>
        </div>
      </section>

      <section class="card stat-card">
        <span class="stat-icon">♙</span>
        <div>
          <b>${data.children.length}</b>
          <small>الطالبات</small>
        </div>
      </section>

      <section class="card stat-card">
        <span class="stat-icon">⇄</span>
        <div>
          <b>${data.trips.length}</b>
          <small>الرحلات المسجلة</small>
        </div>
      </section>

      <section class="card stat-card">
        <span class="stat-icon">♧</span>
        <div>
          <b>${unreadCount()}</b>
          <small>إشعارات غير مقروءة</small>
        </div>
      </section>

    </div>

    <div class="grid grid-2" style="margin-top:18px">

      <section class="card">

        <div class="card-title">
          <h3>إدارة النظام</h3>
        </div>

        <div class="list-row">
          <span class="list-icon">♙</span>
          <div>
            <b>إدارة الطالبات</b>
            <small>إضافة ومراجعة بيانات الطالبات</small>
          </div>
          <button class="btn btn-soft" data-page="students">
            فتح
          </button>
        </div>

        <div class="list-row">
          <span class="list-icon">🚌</span>
          <div>
            <b>إدارة الحافلات</b>
            <small>السائقون والمشرفات والمسارات</small>
          </div>
          <button class="btn btn-soft" data-page="buses">
            فتح
          </button>
        </div>

        <div class="list-row">
          <span class="list-icon">◷</span>
          <div>
            <b>سجل التدقيق</b>
            <small>مراجعة التعديلات على السجلات</small>
          </div>
          <button class="btn btn-soft" data-page="audit">
            فتح
          </button>
        </div>

      </section>

      <section class="card">

        <div class="card-title">
          <h3>آخر الرحلات</h3>
        </div>

        ${tripTable()}

      </section>

    </div>

  `;
}


function auditPage() {

  return `

    ${heading()}

    <section class="card">

      <div class="card-title">
        <h3>سجل التدقيق</h3>
      </div>

      <div class="table-wrap">

        <table>

          <thead>
            <tr>
              <th>الوقت</th>
              <th>المستخدم</th>
              <th>العملية</th>
              <th>التفاصيل</th>
            </tr>
          </thead>

          <tbody>

            ${
              data.audit.map(a => `

                <tr>
                  <td>${a.time}</td>
                  <td>${a.user}</td>
                  <td>${a.action}</td>
                  <td>${a.details}</td>
                </tr>

              `).join("")
              ||
              `<tr><td colspan="4">لا توجد تعديلات مسجلة.</td></tr>`
            }

          </tbody>

        </table>

      </div>

    </section>

  `;
}


/* ==================================
   RENDER ALL PAGES
================================== */

function render() {

  $("#topName").textContent =
    data.users[data.role].name;

  $("#topRole").textContent =
    roleName();

  $("#topAvatar").textContent =
    data.users[data.role].name.charAt(0);

  $("#sideNav").innerHTML =
    navigationHTML();

  $("#mobileNav").innerHTML =
    navigationHTML(true);

  $("#unreadDot").style.display =
    unreadCount() ? "block" : "none";

  $("#roleSwitch").value =
    data.role;

  const pages = {

    home: homePage,
    map: mapPage,
    trips: tripsPage,
    history: historyPage,
    notifications: notificationsPage,
    settings: settingsPage,

    supervisor: supervisorPage,
    students: studentsPage,
    scan: scanPage,
    manage: managePage,
    buses: busesPage,

    admin: adminPage,
    audit: auditPage

  };

  if (!navigation[data.role].some(
    item => item[0] === data.page
  )) {

    data.page =
      data.role === "parent"
        ? "home"
        : data.role === "supervisor"
        ? "supervisor"
        : "admin";

  }

  $("#pageContent").innerHTML =
    pages[data.page]();

}


/* ==================================
   NOTIFICATIONS AND AUDIT
================================== */

function toast(message) {

  const element = $("#toast");

  element.textContent = message;

  element.classList.add("show");

  setTimeout(() => {
    element.classList.remove("show");
  }, 2600);

}

function addNotification(title, body) {

  data.notifications.unshift({

    id: Date.now(),
    title,
    body,

    time: new Date().toLocaleTimeString(
      "ar-SA",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    ),

    read: false

  });

}

function audit(action, details) {

  data.audit.unshift({

    time: new Date().toLocaleString("ar-SA"),

    user: data.users[data.role].name,

    action,
    details

  });

}


/* ==================================
   BARCODE REGISTRATION
================================== */

function recordBarcode(code, type) {

  const student = data.children.find(
    c => c.barcode.toLowerCase() === code.trim().toLowerCase()
  );

  if (!student) {
    toast("لم يتم العثور على هذا الباركود");
    return;
  }

  if (type === "boarding") {

    if (student.status === "على متن الحافلة") {
      toast("تم تسجيل صعود هذه الطالبة مسبقًا");
      return;
    }

    if (student.status === "تم إنزالها") {
      toast("لا يمكن تسجيل صعودها بعد إنزالها في الرحلة نفسها");
      return;
    }

    student.status = "على متن الحافلة";

    addNotification(
      "تم تسجيل صعود " + student.name,
      `تم تسجيل صعود ${student.name} إلى ${student.bus}`
    );

    audit(
      "تسجيل صعود",
      student.name + " • " + code
    );

    toast("تم تسجيل صعود " + student.name);

  } else {

    if (student.status !== "على متن الحافلة") {
      toast("لا يمكن تسجيل النزول قبل تسجيل الصعود");
      return;
    }

    student.status = "تم إنزالها";

    addNotification(
      "تم تسجيل نزول " + student.name,
      `تم تسجيل نزول ${student.name} من ${student.bus}`
    );

    audit(
      "تسجيل نزول",
      student.name + " • " + code
    );

    toast("تم تسجيل نزول " + student.name);

  }

  const trip = data.trips[0];

  if (trip) {

    trip.events.unshift({

      student: student.name,
      type: type === "boarding" ? "صعود" : "نزول",

      time: new Date().toLocaleTimeString(
        "ar-SA",
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      )

    });

  }

  save();

}


/* ==================================
   EVENT HANDLERS
================================== */

document.addEventListener("click", event => {

  const pageButton = event.target.closest("[data-page]");

  if (pageButton) {

    event.preventDefault();

    go(pageButton.dataset.page);

    return;

  }

  const selectChild =
    event.target.closest("[data-select-child]");

  if (selectChild) {

    data.selectedChild =
      selectChild.dataset.selectChild;

    save();

    return;

  }

  const quickScan =
    event.target.closest("[data-quick-scan]");

  if (quickScan) {

    const student = data.children.find(
      c => c.barcode === quickScan.dataset.quickScan
    );

    if (student) {

      const type =
        student.status === "على متن الحافلة"
          ? "dropoff"
          : "boarding";

      recordBarcode(student.barcode, type);

    }

    return;

  }

  const editBus =
    event.target.closest("[data-edit-bus]");

  if (editBus) {

    const bus = data.buses.find(
      b => b.id === editBus.dataset.editBus
    );

    const newDriver = prompt(
      "اسم السائق",
      bus.driver
    );

    if (newDriver) {

      bus.driver = newDriver;

      audit(
        "تعديل بيانات حافلة",
        bus.name
      );

      save();

      toast("تم تحديث البيانات");

    }

  }

});


/* ==================================
   ROLE SWITCHING
================================== */

$("#roleSwitch").addEventListener("change", event => {

  data.role = event.target.value;

  data.page =
    data.role === "parent"
      ? "home"
      : data.role === "supervisor"
      ? "supervisor"
      : "admin";

  save();

});


$("#menuToggle").addEventListener("click", () => {

  $("#sidebar").classList.toggle("open");

});


$("#logoutBtn").addEventListener("click", () => {

  data.role = "parent";
  data.page = "home";

  save();

  toast("تم تسجيل الخروج التجريبي");

});


/* ==================================
   PAGE BUTTON ACTIONS
================================== */

$("#pageContent").addEventListener("click", event => {

  const id = event.target.id;

  if (id === "submitBarcode") {

    recordBarcode(
      $("#barcodeInput").value,
      $("#scanType").value
    );

    return;

  }

  if (id === "markAllRead") {

    data.notifications.forEach(n => {
      n.read = true;
    });

    save();

    toast("تم تحديد الإشعارات كمقروءة");

    return;

  }

  if (id === "saveProfile") {

    const name = $("#profileName").value.trim();

    if (name) {

      data.users[data.role].name = name;

      save();

      toast("تم حفظ الملف الشخصي");

    }

    return;

  }

  if (id === "startTrip") {

    const bus = $("#tripBus").value;
    const period = $("#tripPeriod").value;

    let trip = data.trips[0];

    if (trip && trip.status === "في الطريق") {
      toast("توجد رحلة نشطة بالفعل");
      return;
    }

    trip = {

      id: Date.now(),

      date: new Date().toISOString().slice(0, 10),

      period,

      bus,

      status: "في الطريق",

      start: new Date().toLocaleTimeString(
        "ar-SA",
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      ),

      eta: "07:05",

      progress: 5,

      events: []

    };

    data.trips.unshift(trip);

    addNotification(
      "بدأت الرحلة",
      `بدأت الرحلة ${period} للحافلة ${bus}`
    );

    audit("بدء رحلة", bus);

    save();

    toast("تم بدء الرحلة");

    return;

  }

  if (id === "updateTrip") {

    const trip = data.trips[0];

    if (!trip) return;

    trip.progress =
      Number($("#tripProgress").value);

    trip.status =
      trip.progress >= 100
        ? "وصلت الحافلة"
        : "في الطريق";

    addNotification(
      "تحديث حالة الرحلة",
      "تقدم الرحلة الآن " + trip.progress + "%"
    );

    audit(
      "تحديث رحلة",
      trip.bus + " • " + trip.progress + "%"
    );

    save();

    toast("تم تحديث الرحلة");

    return;

  }

  if (id === "endTrip") {

    const trip = data.trips[0];

    if (!trip) return;

    trip.status = "انتهت الرحلة";
    trip.progress = 100;

    addNotification(
      "انتهت الرحلة",
      "تم إنهاء رحلة " + trip.bus
    );

    audit("إنهاء رحلة", trip.bus);

    save();

    toast("تم إنهاء الرحلة");

    return;

  }

  if (id === "addStudent") {

    const name = prompt("اسم الطالبة الجديدة");

    if (!name) return;

    const barcode =
      "WS-" + Math.floor(3000 + Math.random() * 6000);

    data.children.push({

      id: "student-" + Date.now(),

      name,

      grade: "غير محدد",

      bus: "حافلة 04",

      stop: "يحدد لاحقًا",

      barcode,

      status: "لم تصعد"

    });

    audit(
      "إضافة طالبة",
      name + " • " + barcode
    );

    save();

    toast("تمت إضافة الطالبة ورمزها " + barcode);

    return;

  }

  if (id === "addBus") {

    const name = $("#newBusName").value.trim();

    if (!name) {
      toast("اكتبي اسم الحافلة");
      return;
    }

    data.buses.push({

      id: "B" + Date.now(),

      name,

      driver:
        $("#newBusDriver").value || "غير محدد",

      supervisor:
        $("#newBusSupervisor").value || "غير محددة",

      plate: "غير محدد",

      capacity: 20,

      route: "يحدد لاحقًا",

      status: "لم تبدأ"

    });

    audit("إضافة حافلة", name);

    save();

    toast("تمت إضافة الحافلة");

    return;

  }

  if (id === "exportTrips") {

    const csv = [

      "التاريخ,الفترة,الحافلة,الحالة",

      ...data.trips.map(t => [
        t.date,
        t.period,
        t.bus,
        t.status
      ].join(","))

    ].join("\n");

    const link = document.createElement("a");

    link.href = URL.createObjectURL(
      new Blob(
        ["\ufeff" + csv],
        { type: "text/csv;charset=utf-8" }
      )
    );

    link.download = "wasla-trips.csv";

    link.click();

    URL.revokeObjectURL(link.href);

  }

});


/* ==================================
   SEARCH
================================== */

$("#pageContent").addEventListener("input", event => {

  if (event.target.id === "studentSearch") {

    const query =
      event.target.value.toLowerCase();

    const filtered = data.children.filter(c =>

      (c.name + c.barcode)
        .toLowerCase()
        .includes(query)

    );

    $("#studentsTable").innerHTML =
      studentsTable(filtered);

  }

  if (event.target.id === "historySearch") {

    const query =
      event.target.value.toLowerCase();

    const filtered = data.trips.filter(t =>

      (t.date + t.bus + t.status)
        .toLowerCase()
        .includes(query)

    );

    $("#historyTable").innerHTML =
      tripTable(filtered);

  }

});


/* ==================================
   CAMERA BARCODE SCANNER
================================== */

let cameraStream = null;

$("#pageContent").addEventListener("click", async event => {

  if (event.target.id !== "startCamera") {
    return;
  }

  const frame = $("#cameraFrame");

  if (!("BarcodeDetector" in window)) {

    frame.innerHTML = `
      <span>
        المتصفح لا يدعم قراءة الباركود مباشرة.
        استخدمي الإدخال اليدوي.
      </span>
    `;

    return;

  }

  try {

    cameraStream =
      await navigator.mediaDevices.getUserMedia({

        video: {
          facingMode: "environment"
        }

      });

    const video =
      document.createElement("video");

    video.autoplay = true;
    video.playsInline = true;
    video.srcObject = cameraStream;

    frame.innerHTML = "";
    frame.appendChild(video);

    const detector = new BarcodeDetector({

      formats: ["qr_code", "code_128"]

    });

    async function scan() {

      if (!cameraStream) return;

      try {

        const codes = await detector.detect(video);

        if (codes.length) {

          $("#barcodeInput").value =
            codes[0].rawValue;

          cameraStream.getTracks().forEach(
            track => track.stop()
          );

          cameraStream = null;

          frame.innerHTML = `
            <span>
              تمت قراءة الرمز.
              اختاري نوع الحركة ثم اضغطي تسجيل.
            </span>
          `;

          return;

        }

      } catch (error) {

        console.log(error);

      }

      requestAnimationFrame(scan);

    }

    scan();

  } catch (error) {

    frame.innerHTML = `
      <span>
        تعذر تشغيل الكاميرا.
        تحققي من الإذن واستخدمي الإدخال اليدوي.
      </span>
    `;

  }

});


/* ==================================
   START APPLICATION
================================== */

render();