import AdBanner from "@/components/landing/AdBanner";
import ComingSoon from "@/components/landing/comingsoon";

export default function Home() {
    return (
        <>
            {/* Advertisement Banner at the top */}
            <AdBanner />

            {/* Main Coming Soon Content */}
            <ComingSoon />
        </>
    );
}
