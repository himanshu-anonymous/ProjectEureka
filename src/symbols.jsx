'use client';

import React from 'react';

/**
 * Solid Heroicons Pack - Centralized symbols.jsx
 * Pure SVG implementation of official 24x24 Solid Heroicons (fill="currentColor").
 * All icons across the entire website inherit from this file.
 */

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

// Base SVG wrapper for Solid Heroicons (fill="currentColor")
export const BaseHeroicon = ({
  size = 'md',
  className = '',
  spin = false,
  style,
  children,
  ...props
}) => {
  const sizeClass = typeof size === 'string' && sizeClasses[size] ? sizeClasses[size] : '';
  const inlineSize = typeof size === 'number' ? { width: size, height: size } : undefined;
  const spinClass = spin ? 'animate-spin' : '';
  const combinedClassName = `inline-block shrink-0 align-middle ${sizeClass} ${spinClass} ${className}`.trim();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={combinedClassName}
      style={{ ...inlineSize, ...style }}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
};

// --- Official Heroicons 24x24 Solid Icons ---

// ExclamationCircle
export const ErrorIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ExclamationTriangle
export const WarningIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ArrowDown
export const ArrowDownwardIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M12 2.25a.75.75 0 0 1 .75.75v16.19l6.22-6.22a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06l6.22 6.22V3a.75.75 0 0 1 .75-.75Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ArrowLeft
export const ArrowBackIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ArrowRight
export const ArrowForwardIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ArrowUp
export const ArrowUpwardIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M12 21.75a.75.75 0 0 1-.75-.75V4.81L5.03 11.03a.75.75 0 0 1-1.06-1.06l7.5-7.5a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-.75.75Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ChevronUpDown
export const UnfoldMoreIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M11.47 2.47a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1-1.06 1.06l-2.47-2.47V11.25a.75.75 0 0 1-1.5 0V4.81L8.78 7.28a.75.75 0 0 1-1.06-1.06l3.75-3.75Zm-3.75 14.06a.75.75 0 0 1 1.06 0L11.25 18.94V12.75a.75.75 0 0 1 1.5 0v6.19l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ArrowUpRight
export const NorthEastIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M8.25 3.75H19.5a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-1.5 0V6.56L4.53 20.78a.75.75 0 0 1-1.06-1.06L17.69 5.25H9a.75.75 0 0 1-.75-.75Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// Trophy
export const MilitaryTechIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A3.707 3.707 0 0 0 9.75 14.25v2.25H6.75a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5h-3v-2.25c0-.94-.352-1.798-.936-2.428a6.73 6.73 0 0 0 2.743-1.346 6.753 6.753 0 0 0 6.138-5.6.75.75 0 0 0-.584-.86 47.93 47.93 0 0 0-3.07-.542V2.62a.75.75 0 0 0-.658-.744 49.28 49.28 0 0 0-12.608 0 .75.75 0 0 0-.659.745Zm.694 2.502A47.784 47.784 0 0 1 12 5.048c2.14 0 4.239.117 6.14.341a5.253 5.253 0 0 1-4.78 4.298 6.782 6.782 0 0 0-2.72-.687c-1.026 0-1.98.243-2.72.687a5.253 5.253 0 0 1-4.78-4.298Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// Bell
export const NotificationsIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 0 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// BookOpen
export const MenuBookIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533Zm1.5 16.103A8.204 8.204 0 0 1 18 18.75c1.077 0 2.083.21 3 .585.592.25 1.25-.187 1.25-.828V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// BuildingOffice
export const DomainIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M4.5 2.25a.75.75 0 0 0-.75.75v18c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75V8.25a.75.75 0 0 0-.75-.75H15V3a.75.75 0 0 0-.75-.75H4.5ZM6 6.75A.75.75 0 0 1 6.75 6h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5A.75.75 0 0 1 6 8.25v-1.5Zm0 4.5A.75.75 0 0 1 6.75 10.5h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5Zm0 4.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5Zm4.5-9a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5Zm0 4.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5Zm0 4.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5Zm4.5-4.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5Zm0 4.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// CalendarDays
export const CalendarTodayIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9H3.75v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// Camera
export const PhotoCameraIcon = (props) => (
  <BaseHeroicon {...props}>
    <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
    <path
      fillRule="evenodd"
      d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71 1.065.154 1.83 1.011 1.83 2.086v9.176c0 1.243-1.007 2.25-2.25 2.25H4.5A2.25 2.25 0 0 1 2.25 17.75V8.574c0-1.075.765-1.932 1.83-2.086.465-.067.87-.327 1.11-.71l.822-1.317a2.76 2.76 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// Check
export const CheckIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// CheckCircle
export const CheckCircleIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ChevronLeft
export const ChevronLeftIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ChevronRight
export const ChevronRightIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ChevronDown (ExpandMore)
export const ExpandMoreIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ChevronUp (ExpandLess)
export const ExpandLessIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// Clock
export const ScheduleIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ArrowDownTray
export const DownloadIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ArrowTopRightOnSquare
export const OpenInNewIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M15.75 2.25H21a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0V4.81L11.53 13.53a.75.75 0 0 1-1.06-1.06L19.19 3.75h-3.44a.75.75 0 0 1 0-1.5ZM4.5 5.25A2.25 2.25 0 0 0 2.25 7.5v12A2.25 2.25 0 0 0 4.5 21.75h12A2.25 2.25 0 0 0 18.75 19.5V12a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 1-.75.75H4.5a.75.75 0 0 1-.75-.75V7.5a.75.75 0 0 1 .75-.75H12a.75.75 0 0 0 0-1.5H4.5Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// Eye
export const VisibilityIcon = (props) => (
  <BaseHeroicon {...props}>
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path
      fillRule="evenodd"
      d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// EyeSlash
export const VisibilityOffIcon = (props) => (
  <BaseHeroicon {...props}>
    <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
    <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.243 4.244Z" />
    <path d="M6.205 6.205a11.216 11.216 0 0 0-4.882 5.242 1.762 1.762 0 0 0 0 1.113c1.487 4.471 5.705 7.697 10.677 7.697 1.637 0 3.197-.35 4.607-.981l-2.09-2.09a7.25 7.25 0 0 1-2.517.321 5.25 5.25 0 0 1-5.25-5.25c0-.918.234-1.78.645-2.532L6.205 6.205Z" />
  </BaseHeroicon>
);

// ChartBar
export const BarChartIcon = (props) => (
  <BaseHeroicon {...props}>
    <path d="M18.375 2.25c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h1.5c.621 0 1.125-.504 1.125-1.125V3.375c0-.621-.504-1.125-1.125-1.125h-1.5ZM9.375 8.25c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h1.5c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125h-1.5ZM2.625 14.25c-.621 0-1.125.504-1.125 1.125v5.25c0 .621.504 1.125 1.125 1.125h1.5c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-1.5Z" />
  </BaseHeroicon>
);

// ClipboardDocumentCheck
export const FactCheckIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V9.375m3.75-6.75A2.25 2.25 0 0 1 9 0h3a2.25 2.25 0 0 1 2.25 2.625M13.5 13.5a.75.75 0 0 0 0-1.5h-6a.75.75 0 0 0 0 1.5h6Zm-6 3a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H7.5Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// DocumentText
export const DescriptionIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875ZM12.75 12a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Zm0 3a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Zm-6-3a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Zm0 3a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ArchiveBox
export const InventoryIcon = (props) => (
  <BaseHeroicon {...props}>
    <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
    <path
      fillRule="evenodd"
      d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087ZM9.75 12a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ArrowsRightLeft
export const AltRouteIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M15.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H7.5a.75.75 0 0 1 0-1.5h11.69l-3.22-3.22a.75.75 0 0 1 0-1.06Zm-7.94 9a.75.75 0 0 1 0 1.06l-3.22 3.22H16.5a.75.75 0 0 1 0 1.5H4.81l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// GlobeAlt
export const LanguageIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM6.262 6.072a8.25 8.25 0 0 1 10.565-.678 19.345 19.345 0 0 0-4.07 3.51 12.83 12.83 0 0 0-6.495-2.832Zm12.51 3.535a8.25 8.25 0 0 1 .978 3.893 8.25 8.25 0 0 1-3.218 6.558 11.233 11.233 0 0 0-1.89-6.444 17.844 17.844 0 0 1 4.13-4.007ZM12 19.948a12.84 12.84 0 0 0 2.247-4.604 9.756 9.756 0 0 1-4.494 0A12.84 12.84 0 0 0 12 19.948Zm-4.372-2.115a11.232 11.232 0 0 0-1.89-6.444 17.845 17.845 0 0 1 4.13-4.007 12.83 12.83 0 0 0-1.262 6.558c0 1.43.23 2.808.653 4.093a8.243 8.243 0 0 1-1.631-.2Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ClockRotateRight / History
export const HistoryIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// Photo
export const ImageIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// Key
export const VpnKeyIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c-.067.39-.232.748-.48 1.036L2.406 16.655a1.5 1.5 0 0 0-.406 1.06v2.285a1.5 1.5 0 0 0 1.5 1.5h2.285a1.5 1.5 0 0 0 1.06-.44l1.19-1.19h1.715a.75.75 0 0 0 .53-.22l1.06-1.06a.75.75 0 0 0 .22-.53v-1.19l1.19-1.19a2.25 2.25 0 0 0 .659-1.591V14.5a6.75 6.75 0 1 0 3.33-13ZM18 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// Squares3Stack3D / Layers
export const LayersIcon = (props) => (
  <BaseHeroicon {...props}>
    <path d="M11.644 1.59a.75.75 0 0 1 .712 0l9.75 5.25a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l9.75-5.25Z" />
    <path d="m3.265 10.602 7.668 4.129a1.5 1.5 0 0 0 1.424 0l7.668-4.129 1.637.882a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l1.465-.788Z" />
    <path d="m3.265 15.602 7.668 4.129a1.5 1.5 0 0 0 1.424 0l7.668-4.129 1.637.882a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l1.465-.788Z" />
  </BaseHeroicon>
);

// Squares2X2
export const DashboardIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ListBullet
export const ChecklistIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 12a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12A.75.75 0 0 1 7.5 12Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ArrowPath
export const ProgressActivityIcon = (props) => (
  <BaseHeroicon spin {...props}>
    <path
      fillRule="evenodd"
      d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 1 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 1 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// LockClosed
export const LockIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// Envelope
export const MailIcon = (props) => (
  <BaseHeroicon {...props}>
    <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
    <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
  </BaseHeroicon>
);

// Map
export const MapIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M8.16 2.75a.75.75 0 0 0-.64-.097L2.4 4.015a.75.75 0 0 0-.52.715v14.25a.75.75 0 0 0 .93.73l5.03-1.341 7.2 2.4a.75.75 0 0 0 .64.096l5.12-1.362a.75.75 0 0 0 .52-.716V4.537a.75.75 0 0 0-.93-.73l-5.03 1.341-7.2-2.398ZM9 4.316l6 2v13.368l-6-2V4.316Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// MapPin
export const LocationOnIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ArrowsPointingOut
export const FullscreenIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M3.75 3.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5H5.56l3.97 3.97a.75.75 0 0 1-1.06 1.06L4.5 5.56v3.44a.75.75 0 0 1-1.5 0v-4.5a.75.75 0 0 1 .75-.75Zm16.5 0a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V5.56l-3.97 3.97a.75.75 0 1 1-1.06-1.06L18.44 4.5h-3.44a.75.75 0 0 1 0-1.5h4.5a.75.75 0 0 1 .75.75ZM3.75 20.25a.75.75 0 0 0 .75.75h4.5a.75.75 0 0 0 0-1.5H5.56l3.97-3.97a.75.75 0 0 0-1.06-1.06L4.5 18.44v-3.44a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 .75.75Zm16.5 0a.75.75 0 0 0 .75-.75v-4.5a.75.75 0 0 0-1.5 0v3.44l-3.97-3.97a.75.75 0 0 0-1.06 1.06l3.97 3.97h-3.44a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 .75-.75Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// Bars3
export const MenuIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ChatBubbleBottomCenterText
export const ChatBubbleIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.385 0 9.75-3.694 9.75-8.25s-4.365-8.25-9.75-8.25S2.25 8.194 2.25 12.75c0 2.378 1.189 4.544 3.125 6.035a6.7 6.7 0 0 1-.571 2.859Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ChatBubbleLeftRight
export const SpeakerNotesIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.385 0 9.75-3.694 9.75-8.25s-4.365-8.25-9.75-8.25S2.25 8.194 2.25 12.75c0 2.378 1.189 4.544 3.125 6.035a6.7 6.7 0 0 1-.571 2.859Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// Newspaper
export const NewspaperIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M4.125 3C3.504 3 3 3.504 3 4.125v15.75c0 .621.504 1.125 1.125 1.125h15.75c.621 0 1.125-.504 1.125-1.125V4.125C21 3.504 20.496 3 19.875 3H4.125ZM6 6.75a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 6.75Zm0 3.75a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 10.5Zm0 3.75a.75.75 0 0 1 .75-.75h5.25a.75.75 0 0 1 0 1.5H6.75a.75.75 0 0 1-.75-.75Zm0 3.75a.75.75 0 0 1 .75-.75h5.25a.75.75 0 0 1 0 1.5H6.75a.75.75 0 0 1-.75-.75Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// Pause
export const PauseIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M6.75 5.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm10.5 0a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// Phone
export const CallIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// Play
export const PlayArrowIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// PlayCircle
export const PlayCircleIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.988-4.5-3a.75.75 0 0 0-1.174.624v6a.75.75 0 0 0 1.174.624l4.5-3a.75.75 0 0 0 0-1.248Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// Plus
export const AddIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// Radio
export const PodcastsIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75 0 2.457.909 4.702 2.41 6.425a.75.75 0 1 0 1.122-.996A8.25 8.25 0 1 1 12 20.25a.75.75 0 0 0 0 1.5c5.385 0 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm0 3.75a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ArrowPath
export const RefreshIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 1 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 1 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

export const SyncIcon = RefreshIcon;

// MagnifyingGlass
export const SearchIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M10.5 3.75a6.75 6.75 0 1 0 4.243 11.964l5.271 5.272a.75.75 0 1 0 1.06-1.06l-5.271-5.273A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// PaperAirplane
export const SendIcon = (props) => (
  <BaseHeroicon {...props}>
    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
  </BaseHeroicon>
);

// ServerStack
export const DnsIcon = (props) => (
  <BaseHeroicon {...props}>
    <path d="M4.5 3.75a3 3 0 0 0-3 3v.75a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-.75a3 3 0 0 0-3-3h-15ZM4.5 13.5a3 3 0 0 0-3 3v.75a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-.75a3 3 0 0 0-3-3h-15Z" />
  </BaseHeroicon>
);

// Share
export const ShareIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ShieldCheck
export const ShieldIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ShieldExclamation
export const GppBadIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08ZM12 7.5a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V8.25A.75.75 0 0 1 12 7.5Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// CheckBadge
export const VerifiedUserIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// FaceSmile
export const SentimentSatisfiedIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634Zm5.25 0c-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634Zm-4.995 7.08a.75.75 0 0 1 1.05-.143 3.75 3.75 0 0 0 4.64 0 .75.75 0 1 1 .91 1.196 5.25 5.25 0 0 1-6.496 0 .75.75 0 0 1-.104-1.053Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// Sparkles
export const AutoAwesomeIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ArrowTrendingDown
export const TrendingDownIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M1.72 5.47a.75.75 0 0 1 1.06 0L12 14.69l4.47-4.47a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 1 1-1.06 1.06l-4.72-4.72-4.47 4.47a.75.75 0 0 1-1.06 0L1.72 6.53a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ArrowTrendingUp
export const TrendingUpIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M15.22 6.22a.75.75 0 0 1 1.06 0L21.03 11a.75.75 0 0 1 0 1.06l-4.75 4.72a.75.75 0 0 1-1.06-1.06l3.47-3.47H3a.75.75 0 0 1 0-1.5h15.69l-3.47-3.47a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// Tv
export const TvIcon = (props) => (
  <BaseHeroicon {...props}>
    <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3h-15ZM8.25 21a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z" />
  </BaseHeroicon>
);

// CloudArrowUp
export const CloudUploadIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L7.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// User
export const PersonIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// UserCheck
export const HowToRegIcon = (props) => (
  <BaseHeroicon {...props}>
    <path d="M12 2.25a.75.75 0 0 1 .75.75v.75h3.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H7.5a3 3 0 0 1-3-3V6.75a3 3 0 0 1 3-3H11.25V3a.75.75 0 0 1 .75-.75Z" />
    <path
      fillRule="evenodd"
      d="M7.5 6a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM4.5 19.5a6.75 6.75 0 0 1 13.5 0v.75H4.5v-.75Zm13.28-7.28a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1-1.06 1.06l-1.72-1.72-1.06 1.06a.75.75 0 0 1-1.06-1.06l1.59-1.59Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// UserGroup
export const GroupIcon = (props) => (
  <BaseHeroicon {...props}>
    <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.872a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.229.75.75 0 0 0 .424-.674v-.203a5.25 5.25 0 0 0-5.25-5.25h-.502a7.11 7.11 0 0 1 .502 6.252Z" />
  </BaseHeroicon>
);

// VideoCamera
export const VideocamIcon = (props) => (
  <BaseHeroicon {...props}>
    <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
  </BaseHeroicon>
);

// SpeakerWave
export const VolumeUpIcon = (props) => (
  <BaseHeroicon {...props}>
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.5A2.25 2.25 0 0 0 2.25 9.75v4.5A2.25 2.25 0 0 0 4.5 16.5h1.94l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
    <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
  </BaseHeroicon>
);

// SpeakerXMark
export const VolumeOffIcon = (props) => (
  <BaseHeroicon {...props}>
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.5A2.25 2.25 0 0 0 2.25 9.75v4.5A2.25 2.25 0 0 0 4.5 16.5h1.94l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 0 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" />
  </BaseHeroicon>
);

// XMark
export const CloseIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// ArrowRightStartOnRectangle / Logout
export const LogoutIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9a.75.75 0 0 1-1.5 0V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// Bars3BottomLeft / MenuOpen
export const MenuOpenIcon = (props) => (
  <BaseHeroicon {...props}>
    <path
      fillRule="evenodd"
      d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
      clipRule="evenodd"
    />
  </BaseHeroicon>
);

// Maharashtra Government State Emblem
export const MahaGovIcon = ({ size = 'md', className = '', ...props }) => {
  const sizeClass = typeof size === 'string' && sizeClasses[size] ? sizeClasses[size] : '';
  const inlineSize = typeof size === 'number' ? { width: size, height: size } : undefined;

  return (
    <img
      src="/icon.svg"
      alt="Government of Maharashtra Emblem"
      className={`inline-block shrink-0 object-contain ${sizeClass} ${className}`.trim()}
      style={{ ...inlineSize, ...props.style }}
      {...props}
    />
  );
};

// Comprehensive Map of Icon Name -> Component
export const SYMBOLS = {
  error: ErrorIcon,
  warning: WarningIcon,
  arrow_downward: ArrowDownwardIcon,
  arrow_back: ArrowBackIcon,
  arrow_forward: ArrowForwardIcon,
  arrow_upward: ArrowUpwardIcon,
  unfold_more: UnfoldMoreIcon,
  north_east: NorthEastIcon,
  military_tech: MilitaryTechIcon,
  notifications: NotificationsIcon,
  menu_book: MenuBookIcon,
  domain: DomainIcon,
  calendar_today: CalendarTodayIcon,
  photo_camera: PhotoCameraIcon,
  check: CheckIcon,
  check_circle: CheckCircleIcon,
  chevron_left: ChevronLeftIcon,
  chevron_right: ChevronRightIcon,
  expand_more: ExpandMoreIcon,
  expand_less: ExpandLessIcon,
  schedule: ScheduleIcon,
  download: DownloadIcon,
  open_in_new: OpenInNewIcon,
  visibility: VisibilityIcon,
  visibility_off: VisibilityOffIcon,
  bar_chart: BarChartIcon,
  fact_check: FactCheckIcon,
  description: DescriptionIcon,
  inventory_2: InventoryIcon,
  alt_route: AltRouteIcon,
  language: LanguageIcon,
  history: HistoryIcon,
  image: ImageIcon,
  vpn_key: VpnKeyIcon,
  layers: LayersIcon,
  dashboard: DashboardIcon,
  checklist: ChecklistIcon,
  progress_activity: ProgressActivityIcon,
  lock: LockIcon,
  mail: MailIcon,
  map: MapIcon,
  location_on: LocationOnIcon,
  fullscreen: FullscreenIcon,
  menu: MenuIcon,
  chat_bubble: ChatBubbleIcon,
  speaker_notes: SpeakerNotesIcon,
  newspaper: NewspaperIcon,
  pause: PauseIcon,
  call: CallIcon,
  play_arrow: PlayArrowIcon,
  play_circle: PlayCircleIcon,
  add: AddIcon,
  podcasts: PodcastsIcon,
  refresh: RefreshIcon,
  sync: SyncIcon,
  search: SearchIcon,
  send: SendIcon,
  dns: DnsIcon,
  share: ShareIcon,
  shield: ShieldIcon,
  gpp_bad: GppBadIcon,
  verified_user: VerifiedUserIcon,
  sentiment_satisfied: SentimentSatisfiedIcon,
  auto_awesome: AutoAwesomeIcon,
  trending_down: TrendingDownIcon,
  trending_up: TrendingUpIcon,
  tv: TvIcon,
  cloud_upload: CloudUploadIcon,
  person: PersonIcon,
  how_to_reg: HowToRegIcon,
  group: GroupIcon,
  videocam: VideocamIcon,
  volume_up: VolumeUpIcon,
  volume_off: VolumeOffIcon,
  close: CloseIcon,
  logout: LogoutIcon,
  menu_open: MenuOpenIcon,
  mahagov: MahaGovIcon,
  emblem: MahaGovIcon,
  gov_emblem: MahaGovIcon,
  seal: MahaGovIcon,
};

/**
 * Universal Symbol Component for Solid Heroicons
 */
export const Symbol = ({ name, ...props }) => {
  const IconComponent = SYMBOLS[name];
  if (!IconComponent) {
    return null;
  }
  return <IconComponent {...props} />;
};

export const SymbolIcon = Symbol;

export default Symbol;
