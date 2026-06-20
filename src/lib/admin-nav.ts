import{
    HiChartBar,
    HiDocumentText,
    HiMail,
    HiPhotograph,
    HiBriefcase,
    HiUserGroup,
    HiClipboardList,
    HiSparkles,
    HiCurrencyDollar,
    HiCollection,
} from "react-icons/hi";

export const adminNav = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: HiChartBar,
    },
    {
        label: "Blog",
        href: "/admin/blogs",
        icon: HiDocumentText,
    },
    {
        label: "Services",
        href: "/admin/services",
        icon: HiSparkles,
    },
    {
        label: "Content",
        href: "/admin/content",
        icon: HiCollection,
    },
    {
        label: "Subscriptions",
        href: "/admin/subscriptions",
        icon: HiCurrencyDollar,
    },
    {
        label: "Hiring",
        href: "/admin/vacancies",
        icon: HiBriefcase,
    },
    {
        label: "Applications",
        href: "/admin/applications",
        icon: HiClipboardList,
    },
    {
        label: "Clients",
        href: "/admin/clients",
        icon: HiUserGroup,
    },
    {
        label: "Projects",
        href: "/admin/projects",
        icon: HiClipboardList,
    },
    {
        label: "Inquiries",
        href: "/admin/inquiries",
        icon: HiMail,
    },
    {
        label: "Media",
        href: "/admin/media",
        icon: HiPhotograph,
    },
];
