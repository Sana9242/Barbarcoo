async function runE2ETests() {
  console.log("==================================================");
  console.log("       BARBA & CO. - END-TO-END VERIFICATION      ");
  console.log("==================================================");

  // 1. Verify Frontend Pages
  const pages = [
    { url: "http://localhost:3000/", name: "Home" },
    { url: "http://localhost:3000/services", name: "Services Catalog" },
    { url: "http://localhost:3000/barbers", name: "Master Barbers" },
    { url: "http://localhost:3000/book", name: "Booking Wizard" },
    { url: "http://localhost:3000/book/lookup", name: "Booking Lookup" },
    { url: "http://localhost:3000/contact", name: "Contact & About" },
    { url: "http://localhost:3000/admin/login", name: "Admin Login" },
    { url: "http://localhost:3000/admin", name: "Admin Dashboard" },
  ];

  for (const page of pages) {
    const res = await fetch(page.url);
    if (!res.ok) {
      throw new Error(`Page ${page.name} failed with HTTP status ${res.status}`);
    }
    console.log(`[PASS] Frontend Page: ${page.name.padEnd(20)} -> HTTP ${res.status}`);
  }

  // 2. Test API Endpoints
  const barbersRes = await fetch("http://localhost:5000/api/barbers").then((r) => r.json());
  const servicesRes = await fetch("http://localhost:5000/api/services").then((r) => r.json());
  console.log(`[PASS] API Barbers Count:     ${barbersRes.barbers.length}`);
  console.log(`[PASS] API Services Count:    ${servicesRes.services.length}`);

  // 3. Test Dynamic Slot Availability Calculation
  const barber = barbersRes.barbers[0];
  const service = servicesRes.services[0];
  const testDate = new Date();
  testDate.setDate(testDate.getDate() + 3);
  const dateStr = testDate.toISOString().split("T")[0];

  const slotsRes = await fetch(
    `http://localhost:5000/api/appointments/slots?barberId=${barber.id}&date=${dateStr}&duration=${service.durationMinutes}`
  ).then((r) => r.json());

  const availableSlots = slotsRes.slots.filter((s: any) => s.available);
  console.log(`[PASS] Slots computed:        ${slotsRes.slots.length} intervals (${availableSlots.length} available)`);

  const chosenSlot = availableSlots[0];
  if (!chosenSlot) throw new Error("No available slot found for testing");

  // 4. End-to-End Booking Creation Flow
  console.log(`\n[STEP] Creating Appointment for ${barber.name} on ${dateStr} at ${chosenSlot.time}...`);
  const bookRes = await fetch("http://localhost:5000/api/appointments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerName: "Lord Julian Sterling",
      customerEmail: "julian.sterling@mayfair.com",
      customerPhone: "+1 (555) 839-2041",
      serviceId: service.id,
      barberId: barber.id,
      appointmentDate: dateStr,
      startTime: chosenSlot.time,
      notes: "Testing end-to-end booking flow.",
    }),
  });

  const bookData = await bookRes.json();
  if (!bookRes.ok || !bookData.success) {
    throw new Error(`Booking creation failed: ${JSON.stringify(bookData)}`);
  }

  const newAppt = bookData.appointment;
  console.log(`[PASS] Booking Confirmed! Code: ${newAppt.bookingCode} | Status: ${newAppt.status}`);

  // 5. Customer Booking Lookup by Code
  const lookupRes = await fetch(
    `http://localhost:5000/api/appointments/lookup/${newAppt.bookingCode}`
  ).then((r) => r.json());

  if (!lookupRes.success || lookupRes.appointment.customerName !== "Lord Julian Sterling") {
    throw new Error("Customer lookup failed to retrieve correct booking.");
  }
  console.log(`[PASS] Booking Lookup Verified: ${lookupRes.appointment.customerName} with ${lookupRes.appointment.barber.name}`);

  // 6. Admin Authentication & Session Cookie
  const loginRes = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@barba.co", password: "admin123" }),
  });

  const cookie = loginRes.headers.get("set-cookie");
  const loginData = await loginRes.json();
  if (!loginData.success || !cookie) {
    throw new Error("Admin login failed or cookie not set");
  }
  console.log(`[PASS] Admin Logged In:       ${loginData.user.name} (${loginData.user.role})`);

  // 7. Admin Metrics and Status Transition
  const statsRes = await fetch("http://localhost:5000/api/admin/stats", {
    headers: { Cookie: cookie },
  }).then((r) => r.json());
  console.log(`[PASS] Admin KPI Stats:       Total Revenue: $${statsRes.stats.totalRevenue} | Confirmed Bookings: ${statsRes.stats.confirmedCount}`);

  // 8. Admin Status Update (e.g. mark COMPLETED)
  const updateRes = await fetch(
    `http://localhost:5000/api/admin/appointments/${newAppt.id}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({ status: "COMPLETED" }),
    }
  ).then((r) => r.json());

  if (!updateRes.success || updateRes.appointment.status !== "COMPLETED") {
    throw new Error("Admin status update failed");
  }
  console.log(`[PASS] Status Transition:    ${newAppt.bookingCode} status updated to ${updateRes.appointment.status}`);

  // 9. Firebase Realtime Database Verification
  console.log("\n[STEP] Verifying Firebase Realtime Database user registry...");
  const fbRes = await fetch("http://localhost:5000/api/admin/firebase-users", {
    headers: { Cookie: cookie },
  }).then((r) => r.json());

  if (!fbRes.success || !fbRes.users || fbRes.users.length === 0) {
    throw new Error("Firebase Realtime Database users retrieval failed");
  }
  console.log(`[PASS] Firebase RTDB Admins:  ${fbRes.admins.length} record(s) (Connected: ${fbRes.databaseUrl})`);
  console.log(`[PASS] Firebase RTDB Users:   ${fbRes.users.length} customer user(s) synced in Realtime DB`);

  // Verify the newly created customer exists in Firebase Realtime Database
  const createdCustomer = fbRes.users.find((u: any) => u.email === "julian.sterling@mayfair.com");
  if (!createdCustomer) {
    throw new Error("Newly booked customer Julian Sterling was not found in Firebase Realtime Database");
  }
  console.log(`[PASS] Firebase RTDB Customer: ${createdCustomer.name} (${createdCustomer.email}) with ${createdCustomer.totalBookings} booking(s)`);

  console.log("\n==================================================");
  console.log("       ALL E2E WORKFLOW TESTS PASSED 100%         ");
  console.log("==================================================");
}

runE2ETests().catch((err) => {
  console.error("\n[TEST FAILED]:", err);
  process.exit(1);
});
