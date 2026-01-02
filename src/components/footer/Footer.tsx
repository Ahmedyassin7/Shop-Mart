import { Mail, Phone, Pin } from "lucide-react";
import Link from "next/link";

export default function AppFooter() {
  return (
    <footer className="border-t border-border bg-background mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4 gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow">
                <span className="font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                ShopMart
              </span>
            </div>

            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Your one-stop destination for the latest technology, fashion, and
              lifestyle products. Quality guaranteed with fast shipping and
              excellent customer service.
            </p>

            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <Pin /> 123 Shop Street, October City, DC 12345
              </p>
              <p>
                <Phone /> (+20) 01093333333
              </p>
              <p>
                <Mail /> support@shopmart.com
              </p>
            </div>
          </div>

          <FooterLinksColumn
            title="SHOP"
            links={[
              { label: "Electronics", href: "/categories" },
              { label: "Fashion", href: "/categories" },
              { label: "Home & Garden", href: "/categories" },
              { label: "Sports", href: "/categories" },
              { label: "Deals", href: "/categories" },
            ]}
          />

          <FooterLinksColumn
            title="CUSTOMER SERVICE"
            links={[
              { label: "Contact Us", href: "/contact" },
              { label: "Help Center", href: "/help" },
              { label: "Track Your Order", href: "/track-order" },
              { label: "Returns & Exchanges", href: "/returns" },
              { label: "Size Guide", href: "/size-guide" },
            ]}
          />

          <FooterLinksColumn
            title="ABOUT"
            links={[
              { label: "About ShopMart", href: "/about" },
              { label: "Careers", href: "/careers" },
              { label: "Press", href: "/press" },
              { label: "Investor Relations", href: "/investor-relations" },
              { label: "Sustainability", href: "/sustainability" },
            ]}
          />

          <FooterLinksColumn
            title="POLICIES"
            links={[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms of Service", href: "/terms-of-service" },
              { label: "Cookie Policy", href: "/cookie-policy" },
              { label: "Shipping Policy", href: "/shipping-policy" },
              { label: "Refund Policy", href: "/refund-policy" },
            ]}
          />
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-foreground">ShopMart</span>. All
          rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterLinksColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-foreground font-bold text-sm mb-4">{title}</h3>
      <ul className="space-y-2">
        {links.map((navLink) => (
          <li key={navLink.label}>
            <Link
              href={navLink.href}
              className="text-muted-foreground text-sm hover:text-foreground transition-colors"
            >
              {navLink.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
