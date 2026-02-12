import Link from "next/link";
import { AnimateText } from "@/components";

export function FooterBottomBar() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-sm text-muted-foreground">
        © {currentYear} Drelix. <AnimateText k="footer.rights" />.
      </p>
      <div className="flex gap-6">
        <Link
          href="/privacy"
          className="text-sm cursor-pointer text-muted-foreground hover:text-primary transition-colors"
        >
          <AnimateText k="footer.privacy" />
        </Link>
        <Link
          href="/terms"
          className="text-sm cursor-pointer text-muted-foreground hover:text-primary transition-colors"
        >
          <AnimateText k="footer.terms" />
        </Link>
        <Link
          href="/admin/login"
          className="text-sm cursor-pointer text-muted-foreground hover:text-primary transition-colors"
        >
          Admin
        </Link>
      </div>
    </div>
  );
}
