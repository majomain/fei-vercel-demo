# Next.js App Router Structure

This project has been refactored from a tab-based dashboard to use proper Next.js App Router folder structure.

## New Folder Structure

```
app/
├── page.tsx                    # Main dashboard (overview)
├── equipment/
│   ├── layout.tsx             # Equipment section layout
│   └── page.tsx               # Equipment management page
├── data-logs/
│   ├── layout.tsx             # Data logs section layout
│   └── page.tsx               # Data logs page
├── maintenance/
│   ├── layout.tsx             # Maintenance section layout
│   └── page.tsx               # Maintenance page
├── monitoring/
│   ├── layout.tsx             # Monitoring section layout
│   └── page.tsx               # Monitoring page
├── settings/                   # Settings section
└── alerts/                     # Alerts section
```

## Navigation Changes

### Before (Tab-based)
- `/` (overview tab)
- `/?tab=equipment` (equipment tab)
- `/?tab=data-logs` (data-logs tab)
- `/maintenance` (maintenance page)
- `/monitoring` (monitoring page)

### After (Route-based)
- `/` (overview/dashboard)
- `/equipment` (equipment page)
- `/data-logs` (data-logs page)
- `/maintenance` (maintenance page)
- `/monitoring` (monitoring page)

## Benefits of New Structure

1. **SEO-friendly**: Each route gets its own URL
2. **Better navigation**: Users can bookmark specific pages
3. **Code splitting**: Each route gets its own bundle
4. **Cleaner URLs**: No more query parameters
5. **Proper routing**: Next.js can handle these as separate pages
6. **Better user experience**: Browser back/forward buttons work correctly
7. **Easier maintenance**: Separate components for each route

## Component Organization

- **Dashboard component** (`components/dashboard.tsx`): Now only shows overview content
- **Equipment page** (`app/equipment/page.tsx`): Dedicated equipment management
- **Data logs page** (`app/data-logs/page.tsx`): Dedicated data logs view
- **Navigation** (`components/dashboard-layout.tsx`): Updated to use proper routes

## Migration Notes

- Removed tab-based conditional rendering from dashboard
- Updated navigation handlers to use proper routes
- Each page now has its own layout and page component
- Cleaner separation of concerns between different sections
