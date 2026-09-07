import HomeExperience from "@/components/HomeExperience";
import GuideDiscovery from "@/components/guide/GuideDiscovery";
import JsonLd from "@/components/guide/JsonLd";
import { SITE, absolute } from "@/lib/site";

export default function Home() {
  return <>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, url: absolute("/"), inLanguage: "tr-TR" }} />
    <HomeExperience guideLinks={<GuideDiscovery />} />
  </>;
}
