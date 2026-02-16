import { languages } from "@/i18n/translations";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const countryCodeMap: Record<string, string> = {
  sv: "se",
  en: "gb",
  es: "es",
  pl: "pl",
  de: "de",
};

function FlagImg({ langCode, size = 20 }: { langCode: string; size?: number }) {
  const country = countryCodeMap[langCode] || langCode;
  return (
    <img
      src={`https://flagcdn.com/w40/${country}.png`}
      srcSet={`https://flagcdn.com/w80/${country}.png 2x`}
      width={size}
      height={Math.round(size * 0.75)}
      alt=""
      className="rounded-[2px] object-cover"
    />
  );
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const current = languages.find((l) => l.code === language)!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground text-xs">
          <FlagImg langCode={language} />
          {current.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="min-w-[140px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? "bg-accent" : ""}
          >
            <FlagImg langCode={lang.code} />
            <span className="ml-2">{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
