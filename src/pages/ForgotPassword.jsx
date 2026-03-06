import ForgotPassword from "./pages/ForgotPassword.jsx";

// Routes mein add karo:
<Route path="/forgot-password" element={<ForgotPassword />} />
```

Supabase Dashboard mein bhi ek setting check karo — **Authentication → Email Templates → Reset Password** — wahan redirect URL set karo:
```