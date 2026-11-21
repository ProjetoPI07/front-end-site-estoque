function conteudoDoIcone(nome) {
  switch (nome) {
    case "box":
      return (
        <>
          <path d="M21 8.5v7a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 15.5v-7a2 2 0 0 1 1-1.73l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8.5Z" />
          <path d="m3.3 7.5 8.7 4.5 8.7-4.5" />
          <path d="M12 12v9.2" />
        </>
      );
    case "plus":
      return <path d="M12 5v14M5 12h14" />;
    case "minus":
      return <path d="M5 12h14" />;
    case "pencil":
      return (
        <>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </>
      );
    case "chart":
      return (
        <>
          <path d="M3 20h18" />
          <path d="M5 20v-7M12 20V7M19 20v-4" />
        </>
      );
    case "bell":
      return (
        <>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </>
      );
    case "logout":
      return (
        <>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="m16 17 5-5-5-5" />
          <path d="M21 12H9" />
        </>
      );
    case "upload":
      return (
        <>
          <path d="M12 16V4" />
          <path d="m8 8 4-4 4 4" />
          <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
        </>
      );
    case "eye":
      return (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      );
    case "eyeOff":
      return (
        <>
          <path d="m3 3 18 18" />
          <path d="M10.6 5.2A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a18.4 18.4 0 0 1-3 3.9" />
          <path d="M6.6 6.6C3.6 8.6 2 12 2 12s3.5 7 10 7a10.7 10.7 0 0 0 5.4-1.5" />
          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        </>
      );
    case "search":
      return (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </>
      );
    case "save":
      return (
        <>
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
          <path d="M17 21v-8H7v8" />
          <path d="M7 3v5h8" />
        </>
      );
    case "arrowRight":
      return (
        <>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </>
      );
    case "check":
      return <path d="m5 13 4 4L19 7" />;
    case "close":
      return <path d="M18 6 6 18M6 6l12 12" />;
    case "help":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4" />
          <path d="M12 17h.01" />
        </>
      );
    case "card":
      return (
        <>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
          <path d="M6 15h4" />
        </>
      );
    case "calendar":
      return (
        <>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </>
      );
    case "chevronDown":
      return <path d="m6 9 6 6 6-6" />;
    case "trash":
      return (
        <>
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="m6 6 1 14h10l1-14" />
          <path d="M10 10v6M14 10v6" />
        </>
      );
    case "alert":
      return (
        <>
          <path d="M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </>
      );
    case "menu":
      return <path d="M4 6h16M4 12h16M4 18h16" />;
    case "boxOpen":
      return (
        <>
          <path d="m3.3 7.5 8.7 4.5 8.7-4.5" />
          <path d="M12 12v9.2" />
          <path d="M21 8.5v7a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 15.5v-7" />
          <path d="M7.5 4.7 16.5 9.3" />
        </>
      );
    default:
      return <circle cx="12" cy="12" r="8" />;
  }
}

export default function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
  className = "",
  title,
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : "true"}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {conteudoDoIcone(name)}
    </svg>
  );
}
