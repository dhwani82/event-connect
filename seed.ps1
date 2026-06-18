# EventConnect Data Seeder
# Run: Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process; .\seed.ps1

$BASE = "http://localhost:8090"

function Post($path, $body) {
    $json = $body | ConvertTo-Json
    $json | Out-File -Encoding utf8 -FilePath "tmp_body.json"
    $result = curl.exe -s -X POST "$BASE$path" -H "Content-Type: application/json" -d "@tmp_body.json"
    try { return $result | ConvertFrom-Json } catch { Write-Host "    ERROR: $result" -ForegroundColor Red; return $null }
}

Write-Host "`n=== EventConnect Data Seeder ===" -ForegroundColor Cyan

# ── 1. CUSTOMERS ──────────────────────────────────────────────────────────────
Write-Host "`n1. Creating customers..." -ForegroundColor Yellow

$c1  = Post "/api/users/register" @{ name="Sarah Mitchell";   email="sarah.mitchell@gmail.com";  password="password123"; role="CUSTOMER" }
$c2  = Post "/api/users/register" @{ name="James Rodriguez";  email="james.rodriguez@gmail.com"; password="password123"; role="CUSTOMER" }
$c3  = Post "/api/users/register" @{ name="Priya Patel";      email="priya.patel@gmail.com";     password="password123"; role="CUSTOMER" }
$c4  = Post "/api/users/register" @{ name="Marcus Thompson";  email="marcus.thompson@gmail.com"; password="password123"; role="CUSTOMER" }
$c5  = Post "/api/users/register" @{ name="Aisha Johnson";    email="aisha.johnson@gmail.com";   password="password123"; role="CUSTOMER" }
$c6  = Post "/api/users/register" @{ name="David Chen";       email="david.chen@gmail.com";      password="password123"; role="CUSTOMER" }

Write-Host "  Sarah Mitchell   -> $($c1.id)" -ForegroundColor Green
Write-Host "  James Rodriguez  -> $($c2.id)" -ForegroundColor Green
Write-Host "  Priya Patel      -> $($c3.id)" -ForegroundColor Green
Write-Host "  Marcus Thompson  -> $($c4.id)" -ForegroundColor Green
Write-Host "  Aisha Johnson    -> $($c5.id)" -ForegroundColor Green
Write-Host "  David Chen       -> $($c6.id)" -ForegroundColor Green

# ── 2. VENDOR USER ACCOUNTS ───────────────────────────────────────────────────
Write-Host "`n2. Creating vendor accounts..." -ForegroundColor Yellow

$vu1  = Post "/api/users/register" @{ name="Lumiere Studios";         email="lumiere@gmail.com";       password="password123"; role="VENDOR" }
$vu2  = Post "/api/users/register" @{ name="Feast and Co";            email="feast@gmail.com";          password="password123"; role="VENDOR" }
$vu3  = Post "/api/users/register" @{ name="Bloom Decor";             email="bloom@gmail.com";          password="password123"; role="VENDOR" }
$vu4  = Post "/api/users/register" @{ name="Rhythmix DJ";             email="rhythmix@gmail.com";       password="password123"; role="VENDOR" }
$vu5  = Post "/api/users/register" @{ name="Golden Lens Photography"; email="goldenlens@gmail.com";     password="password123"; role="VENDOR" }
$vu6  = Post "/api/users/register" @{ name="The Catering House";      email="cateringhouse@gmail.com";  password="password123"; role="VENDOR" }
$vu7  = Post "/api/users/register" @{ name="Petal and Vine Decor";    email="petalvine@gmail.com";      password="password123"; role="VENDOR" }
$vu8  = Post "/api/users/register" @{ name="SoundWave Entertainment"; email="soundwave@gmail.com";      password="password123"; role="VENDOR" }
$vu9  = Post "/api/users/register" @{ name="Click and Capture";       email="clickcapture@gmail.com";   password="password123"; role="VENDOR" }
$vu10 = Post "/api/users/register" @{ name="Spice Route Catering";    email="spiceroute@gmail.com";     password="password123"; role="VENDOR" }

Write-Host "  10 vendor accounts created" -ForegroundColor Green

# ── 3. VENDOR PROFILES ────────────────────────────────────────────────────────
Write-Host "`n3. Creating vendor profiles..." -ForegroundColor Yellow

$v1 = Post "/api/vendors" @{
    userId=$vu1.id; businessName="Lumiere Studios"; category="PHOTOGRAPHY"
    description="Award-winning photography studio specializing in weddings, corporate events, and portraits. With over 10 years of experience, we capture every precious moment with artistic precision and a personal touch. Our team of 5 photographers ensures no moment goes unnoticed."
    city="New York"; pricePerHour=250
}
$v2 = Post "/api/vendors" @{
    userId=$vu2.id; businessName="Feast and Co"; category="CATERING"
    description="Premium catering service offering farm-to-table cuisine for weddings, corporate events, and private parties. We source fresh local ingredients and craft custom menus tailored to your event theme, dietary needs, and budget. Serving up to 500 guests."
    city="New York"; pricePerHour=180
}
$v3 = Post "/api/vendors" @{
    userId=$vu3.id; businessName="Bloom Decor"; category="DECOR"
    description="Luxury event decoration and floral design studio. We transform any space into a breathtaking experience. From intimate garden weddings to grand corporate galas, we specialize in floral installations, lighting design, and custom centerpieces."
    city="Los Angeles"; pricePerHour=200
}
$v4 = Post "/api/vendors" @{
    userId=$vu4.id; businessName="Rhythmix DJ"; category="MUSIC"
    description="Professional DJ and entertainment service with 8 years of experience keeping dance floors packed. We specialize in weddings, birthday parties, and corporate events. Our state-of-the-art sound and lighting system creates an unforgettable atmosphere."
    city="Chicago"; pricePerHour=150
}
$v5 = Post "/api/vendors" @{
    userId=$vu5.id; businessName="Golden Lens Photography"; category="PHOTOGRAPHY"
    description="Boutique photography studio focused on storytelling through candid and fine art photography. We offer full-day wedding coverage, engagement sessions, and corporate headshots. Known for our warm, natural editing style and exceptional attention to detail."
    city="Los Angeles"; pricePerHour=220
}
$v6 = Post "/api/vendors" @{
    userId=$vu6.id; businessName="The Catering House"; category="CATERING"
    description="Family-owned catering business with 20 years of tradition. We specialize in classic American comfort food elevated to fine dining standards. Our signature BBQ packages and buffet spreads are perfect for both casual and formal events up to 300 guests."
    city="Chicago"; pricePerHour=130
}
$v7 = Post "/api/vendors" @{
    userId=$vu7.id; businessName="Petal and Vine Decor"; category="DECOR"
    description="Eco-conscious event decoration studio using sustainable florals and recycled materials. We create stunning bohemian, rustic, and garden-themed event designs. Every arrangement is custom-designed to tell your unique story while minimizing environmental impact."
    city="Austin"; pricePerHour=160
}
$v8 = Post "/api/vendors" @{
    userId=$vu8.id; businessName="SoundWave Entertainment"; category="MUSIC"
    description="Full-service live entertainment company offering bands, DJs, solo performers, and MCs. From jazz quartets for cocktail hours to high-energy bands for wedding receptions, we curate the perfect musical experience for every moment of your event."
    city="New York"; pricePerHour=300
}
$v9 = Post "/api/vendors" @{
    userId=$vu9.id; businessName="Click and Capture"; category="PHOTOGRAPHY"
    description="Modern photography and videography duo specializing in cinematic wedding films and creative event coverage. Our packages include same-day edits, drone footage, and a full gallery delivered within 2 weeks. We make your memories last forever."
    city="Austin"; pricePerHour=190
}
$v10 = Post "/api/vendors" @{
    userId=$vu10.id; businessName="Spice Route Catering"; category="CATERING"
    description="Authentic South Asian and fusion catering service bringing rich flavors and culinary traditions to your special occasions. Our chefs trained across India, Thailand, and the Middle East. Perfect for multicultural weddings and corporate diversity events."
    city="Los Angeles"; pricePerHour=160
}

Write-Host "  10 vendor profiles created" -ForegroundColor Green

# ── 4. EVENTS ─────────────────────────────────────────────────────────────────
Write-Host "`n4. Creating events..." -ForegroundColor Yellow

$e1 = Post "/api/events" @{
    customerId=$c1.id; title="Sarah and Tom Wedding"
    description="A romantic garden wedding ceremony and reception for 150 guests. Looking for photography, catering, and floral decoration. Theme is romantic garden with white, blush, and sage green colors."
    eventDate="2026-09-15"; guestCount=150; city="New York"; status="PUBLISHED"
}
$e2 = Post "/api/events" @{
    customerId=$c2.id; title="TechVision Annual Conference"
    description="Corporate annual conference for 300 attendees. Full-day event including keynotes, breakout sessions, and an evening gala dinner. Professional photography and premium catering required."
    eventDate="2026-10-22"; guestCount=300; city="Chicago"; status="PUBLISHED"
}
$e3 = Post "/api/events" @{
    customerId=$c3.id; title="Priya 30th Birthday Celebration"
    description="A Bollywood-themed birthday bash for 80 guests. Looking for authentic South Asian catering, vibrant decoration, and a DJ who knows Bollywood music. Venue is a private rooftop in LA."
    eventDate="2026-08-10"; guestCount=80; city="Los Angeles"; status="PUBLISHED"
}
$e4 = Post "/api/events" @{
    customerId=$c4.id; title="Thompson Family Reunion"
    description="Annual family reunion for 120 family members across three generations. Outdoor BBQ-style event with live music, catering, and photography to capture family memories."
    eventDate="2026-07-04"; guestCount=120; city="Chicago"; status="PUBLISHED"
}
$e5 = Post "/api/events" @{
    customerId=$c5.id; title="Aisha Baby Shower"
    description="An intimate garden baby shower for 40 guests. Looking for elegant floral decoration, light catering with custom desserts, and a photographer to capture the special moments."
    eventDate="2026-07-20"; guestCount=40; city="New York"; status="PUBLISHED"
}
$e6 = Post "/api/events" @{
    customerId=$c6.id; title="David and Lisa Engagement Party"
    description="Cocktail-style engagement celebration for 60 guests. Looking for a DJ for background and dance music, catering with passed appetizers and a champagne tower, and photography."
    eventDate="2026-08-30"; guestCount=60; city="Los Angeles"; status="PUBLISHED"
}
$e7 = Post "/api/events" @{
    customerId=$c1.id; title="Sarah Bridal Shower"
    description="Intimate bridal shower for 25 close friends and family before the wedding. Tea party theme with elegant decor, light bites, and a photographer."
    eventDate="2026-08-01"; guestCount=25; city="New York"; status="DRAFT"
}
$e8 = Post "/api/events" @{
    customerId=$c4.id; title="Marcus 40th Birthday Surprise"
    description="Surprise birthday party for 50 guests. Looking for a DJ, catering, and photography. Secret planning required."
    eventDate="2026-09-05"; guestCount=50; city="Chicago"; status="DRAFT"
}

Write-Host "  8 events created" -ForegroundColor Green

# ── 5. BOOKINGS ───────────────────────────────────────────────────────────────
Write-Host "`n5. Creating bookings..." -ForegroundColor Yellow

# Sarah Wedding
Post "/api/bookings" @{ eventId=$e1.id; vendorId=$v1.id; customerId=$c1.id; totalAmount=3000 } | Out-Null
Post "/api/bookings" @{ eventId=$e1.id; vendorId=$v2.id; customerId=$c1.id; totalAmount=5400 } | Out-Null
Post "/api/bookings" @{ eventId=$e1.id; vendorId=$v3.id; customerId=$c1.id; totalAmount=2400 } | Out-Null
Write-Host "  Sarah Wedding: Lumiere Studios + Feast and Co + Bloom Decor" -ForegroundColor Green

# James Conference
Post "/api/bookings" @{ eventId=$e2.id; vendorId=$v5.id; customerId=$c2.id; totalAmount=2640 } | Out-Null
Post "/api/bookings" @{ eventId=$e2.id; vendorId=$v6.id; customerId=$c2.id; totalAmount=3900 } | Out-Null
Post "/api/bookings" @{ eventId=$e2.id; vendorId=$v8.id; customerId=$c2.id; totalAmount=3600 } | Out-Null
Write-Host "  James Conference: Golden Lens + Catering House + SoundWave" -ForegroundColor Green

# Priya Birthday
Post "/api/bookings" @{ eventId=$e3.id; vendorId=$v10.id; customerId=$c3.id; totalAmount=1920 } | Out-Null
Post "/api/bookings" @{ eventId=$e3.id; vendorId=$v4.id;  customerId=$c3.id; totalAmount=1200 } | Out-Null
Post "/api/bookings" @{ eventId=$e3.id; vendorId=$v3.id;  customerId=$c3.id; totalAmount=1600 } | Out-Null
Write-Host "  Priya Birthday: Spice Route + Rhythmix DJ + Bloom Decor" -ForegroundColor Green

# Marcus Reunion
Post "/api/bookings" @{ eventId=$e4.id; vendorId=$v6.id; customerId=$c4.id; totalAmount=2600 } | Out-Null
Post "/api/bookings" @{ eventId=$e4.id; vendorId=$v9.id; customerId=$c4.id; totalAmount=1520 } | Out-Null
Write-Host "  Marcus Reunion: Catering House + Click and Capture" -ForegroundColor Green

# Aisha Baby Shower
Post "/api/bookings" @{ eventId=$e5.id; vendorId=$v7.id; customerId=$c5.id; totalAmount=960  } | Out-Null
Post "/api/bookings" @{ eventId=$e5.id; vendorId=$v2.id; customerId=$c5.id; totalAmount=1440 } | Out-Null
Write-Host "  Aisha Baby Shower: Petal and Vine + Feast and Co" -ForegroundColor Green

# David Engagement
Post "/api/bookings" @{ eventId=$e6.id; vendorId=$v4.id; customerId=$c6.id; totalAmount=1200 } | Out-Null
Post "/api/bookings" @{ eventId=$e6.id; vendorId=$v5.id; customerId=$c6.id; totalAmount=1760 } | Out-Null
Write-Host "  David Engagement: Rhythmix DJ + Golden Lens" -ForegroundColor Green

# Cleanup
if (Test-Path "tmp_body.json") { Remove-Item "tmp_body.json" }

# ── SUMMARY ───────────────────────────────────────────────────────────────────
Write-Host "`n=== SEEDING COMPLETE ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "CUSTOMER LOGINS (password: password123)" -ForegroundColor Yellow
Write-Host "  sarah.mitchell@gmail.com"
Write-Host "  james.rodriguez@gmail.com"
Write-Host "  priya.patel@gmail.com"
Write-Host "  marcus.thompson@gmail.com"
Write-Host "  aisha.johnson@gmail.com"
Write-Host "  david.chen@gmail.com"
Write-Host ""
Write-Host "VENDOR LOGINS (password: password123)" -ForegroundColor Yellow
Write-Host "  lumiere@gmail.com        (Photography, New York)"
Write-Host "  feast@gmail.com          (Catering, New York)"
Write-Host "  bloom@gmail.com          (Decor, Los Angeles)"
Write-Host "  rhythmix@gmail.com       (Music, Chicago)"
Write-Host "  goldenlens@gmail.com     (Photography, Los Angeles)"
Write-Host "  cateringhouse@gmail.com  (Catering, Chicago)"
Write-Host "  petalvine@gmail.com      (Decor, Austin)"
Write-Host "  soundwave@gmail.com      (Music, New York)"
Write-Host "  clickcapture@gmail.com   (Photography, Austin)"
Write-Host "  spiceroute@gmail.com     (Catering, Los Angeles)"
Write-Host ""
Write-Host "Open http://localhost:5173 to see the live data!" -ForegroundColor Green
