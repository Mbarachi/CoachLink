# Sprint 2 - Coach Discovery

## Sprint Goal

Allow users to discover coaches and view coach profiles.

At the end of Sprint 2:

Home
→ Search
→ Coach Listing
→ Coach Profile

No booking creation yet.

Use mock data only.

---

# MVP Geography

Launch Area:

Amuwo Odofin, Lagos

All mock coaches should belong to Amuwo Odofin.

No area filtering required.

---

# Screen 1 - Search

Route:
/search

Components:

* Search Input
* Sport Filter
* Venue Filter

Sports:

* Swimming
* Tennis

Venues:

* MU Court
* Festival Hotel Pool
* Golden Tulip Pool
* Appleton School
* Private Residence

Actions:

Search
→ Coach List

---

# Screen 2 - Coach Listing

Route:
/coaches

Coach Card Fields:

* Profile Image
* Coach Name
* Sport
* Venue
* Rating
* Session Rate

Actions:

View Profile

Sorting:

* Highest Rated
* Lowest Price
* Most Experienced

---

# Screen 3 - Coach Profile

Route:
/coaches/:id

Display:

* Coach Image
* Coach Name
* Verified Badge
* Sport
* Rating
* Years Experience
* Venue
* Bio
* Session Rate

Sections:

About Coach

Pricing

Reviews Summary

Actions:

Request Session

Current Behavior:

Display:

"Booking requests will be available in Sprint 3"

---

# Coach Object

{
id,
name,
sport,
venue,
experience,
rating,
sessionRate,
bio,
image
}

---

# Mock Data

Create:

features/coaches/data/mockCoaches.ts

Minimum:

10 coaches

Sports:

* Swimming
* Tennis

Venues:

* MU Court
* Festival Hotel Pool
* Golden Tulip Pool
* Appleton School
* Private Residence

---

# Reusable Components

Create:

* CoachCard
* CoachBadge
* RatingDisplay
* PriceTag

---

# Sprint Exit Criteria

User can:

Home
→ Search
→ Coach List
→ Coach Profile

without errors.

No backend integration required.