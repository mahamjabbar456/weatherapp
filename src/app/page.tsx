import WeatherWidget from "@/components/WeatherWidget";
import Image from "next/image";

export default function Home() {
  return (
    <div className="text-black">
      <WeatherWidget />
    </div>
  );
}
